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
import { CognitoJwtVerifier } from 'aws-jwt-verify';

export type Access = 'user' | 'admin';

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

  if (user.role === 'admin') {
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
  } catch (error: unknown) {
    return unauthorisedPolicy();
  }
};
