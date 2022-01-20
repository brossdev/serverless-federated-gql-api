import {
  Context,
  APIGatewayTokenAuthorizerEvent,
  APIGatewayAuthorizerResult,
  PolicyDocument,
  Statement,
} from 'aws-lambda';
import { DynamoDB, GetItemInput } from '@aws-sdk/client-dynamodb';
import { DB_MAP } from './helpers/db-schema';
import type { UserType } from './helpers/db-schema';
// import * as JWT from 'jsonwebtoken';
// import jwkToPem from 'jwk-to-pem';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
// import * as Axios from 'axios';

export type Access = 'user' | 'pro';

// interface Role {
//   name: string;
//   access: Access;
// }

// interface PublicKey {
//   alg: string;
//   e: string;
//   kid: string;
//   kty: string;
//   n: string;
//   use: string;
// }

// interface PublicKeyMeta {
//   instance: PublicKey;
//   pem: string;
// }

// interface PublicKeys {
//   keys: PublicKey[];
// }

// interface MapOfKidToPublicKey {
//   [key: string]: PublicKeyMeta;
// }

// interface Claim {
//   token_use: string;
//   auth_time: number;
//   iss: string;
//   exp: number;
//   username: string;
//   client_id: string;
// }

// let cacheKeys: MapOfKidToPublicKey | undefined;
// const getPublicKeys = async (jwkUrl: string): Promise<MapOfKidToPublicKey> => {
//   if (!cacheKeys) {
//     const publicKeys = await Axios.default.get<PublicKeys>(jwkUrl);
//     cacheKeys = publicKeys.data.keys.reduce((agg, current) => {
//       const pem = jwkToPem(current);
//       agg[current.kid] = { instance: current, pem };
//       return agg;
//     }, {} as MapOfKidToPublicKey);
//     return cacheKeys;
//   } else {
//     return cacheKeys;
//   }
// };
// export const getValidJwt = (authorizationToken: string): JWT.Jwt => {
//   if (!authorizationToken) {
//     throw new Error('missing auth token');
//   }

//   if (!authorizationToken.trim()) {
//     throw new Error('invalid token');
//   }

//   const decoded = JWT.decode(authorizationToken, { complete: true });

//   if (!decoded) {
//     throw new Error('failed to decode token');
//   }
//   return decoded;
// };

const getVerifiedToken = async (token: string, userPoolId: string) => {
  try {
    if (!token) {
      throw new Error('missing auth token');
    }

    if (!token.trim()) {
      throw new Error('invalid token');
    }
    const verifier = CognitoJwtVerifier.create({
      userPoolId,
      tokenUse: 'access',
      clientId: 'test',
    });

    const payload = await verifier.verify(token);
    console.log('Token is valid. Payload:', payload);
    return payload;
  } catch {
    console.log('Token not valid!');
    throw new Error('token not valid');
  }
};

// export const checkSignature = async (
//   encodedToken: string,
//   decodedToken: JWT.Jwt,
//   userPoolId: string,
//   region: string,
// ): Promise<void> => {
//   const jwkUrl = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
//   const publicKeys = await getPublicKeys(jwkUrl);
//   const kid = decodedToken.header.kid ?? '';
//   const key = publicKeys[kid];
//   if (key === undefined) {
//     throw new Error('claim made for unknown kid');
//   }
//   JWT.verify(encodedToken, key.pem, {
//     issuer: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`,
//     algorithms: ['RS256'],
//   });
// };

// export const getValidRoles = (token: JWT.Jwt): Role[] => {
//   const rolesOnToken = token.payload.roles;

//   if (!rolesOnToken) {
//     return [];
//   }

//   const validRoles = [];

//   for (const role of rolesOnToken) {
//     // new role - check basic formatting
//     const parts = role.split('.');

//     if (parts.length !== 2) {
//       continue;
//     }

//     const [name, access] = parts;

//     if (!name || !access) {
//       continue;
//     }
//     // take advantage of typescript here to check if it includes any access types
//     if (['read', 'write'].includes(access.toLowerCase())) {
//       validRoles.push(access.toLowerCase());
//     }
//   }
//   return validRoles;
// };

const newPolicyDocument = (statements: Statement[]): PolicyDocument => {
  return {
    Version: '2012-10-17',
    Statement: statements,
  };
};

const mapUserRolesToStatements = (user: UserType): Statement[] => {
  // add sections for adming, billing etc in here for resources related to this
  let statements: Statement[] = [];

  // switch to a case statement after authoriser is working

  if (user.role === 'pro') {
    // all for testing, will be mapped to specific resources on refinement
    const adminStatement = {
      Action: 'execute-api:Invoke',
      Effect: 'Allow',
      Resource: '*',
    };
    statements = [...statements, adminStatement];
  } else {
    const userStatement = {
      Action: 'execute-api:Invoke',
      Effect: 'Allow',
      Resource: '*',
    };
    statements = [...statements, userStatement];
  }
  return statements;
};

const unauthorisedPolicy = (): APIGatewayAuthorizerResult => {
  const statements: Statement[] = [
    {
      Action: 'execute-api:Invoke',
      Effect: 'Deny',
      Resource: '*',
    },
  ];

  return {
    principalId: 'unauthorized',
    policyDocument: newPolicyDocument(statements),
  };
};

export const handler = async function (
  event: APIGatewayTokenAuthorizerEvent,
  context: Context,
): Promise<APIGatewayAuthorizerResult> {
  try {
    console.log({ context });
    // const region = process.env.AWS_REGION || 'eu-west-1';
    const tableName = process.env.TABLE_NAME;
    const userPoolId = process.env.USERPOOL_ID || '';
    if (!userPoolId || !tableName) {
      throw new Error('env var required for cognito pool and table');
    }

    const tokenPayload = await getVerifiedToken(
      event.authorizationToken,
      userPoolId,
    );
    // get user access permissions for organisations before mapping

    const getUserItem = DB_MAP.USER.getInput({ id: tokenPayload.sub });

    const getUserInput: GetItemInput = {
      TableName: tableName,
      Key: getUserItem,
    };

    const db = new DynamoDB({ region: 'eu-west-1' });
    // parse user data
    const user = DB_MAP.USER.parse(await db.getItem(getUserInput));
    if (!user) {
      throw new Error('no user present');
    }
    // map scope to Statement
    const statements = mapUserRolesToStatements(user);

    return {
      principalId: tokenPayload.sub ?? 'unauthorized',
      policyDocument: newPolicyDocument(statements),
    };
  } catch (error: any) {
    return unauthorisedPolicy();
  }
};
