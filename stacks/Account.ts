import * as sst from '@serverless-stack/resources';
import * as iam from '@aws-cdk/aws-iam';
import * as cognito from '@aws-cdk/aws-cognito';
import * as apigAuthorizers from '@aws-cdk/aws-apigatewayv2-authorizers';

interface AccountStackProps extends sst.StackProps {
  readonly table: sst.Table;
  readonly userpool: cognito.UserPool;
  readonly userpoolClient: cognito.UserPoolClient;
}

export default class AccountStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props: AccountStackProps) {
    super(scope, id, props);

    const AWS_ACCOUNT_ID = sst.Stack.of(this).account;
    const AWS_REGION = sst.Stack.of(this).region;

    const { table, userpool, userpoolClient } = props;
    //    const tableName = ssm.StringParameter.fromStringParameterAttributes(
    //      this,
    //      'tablename',
    //      {
    //        parameterName: '/gql-federation/database',
    //      },
    //    );
    //
    //    const userPoolId = ssm.StringParameter.fromStringParameterAttributes(
    //      this,
    //      'userPoolId',
    //      {
    //        parameterName: '/gql-federation/userpool',
    //      },
    //    );
    //
    //    const userPoolClientId = ssm.StringParameter.fromStringParameterAttributes(
    //      this,
    //      'userPoolClientId',
    //      {
    //        parameterName: '/gql-federation/userpool-client',
    //      },
    //    );
    //
    const api = new sst.Api(this, 'AccountApi', {
      defaultAuthorizer: new apigAuthorizers.HttpJwtAuthorizer({
        identitySource: ['$request.header.authorization'],
        jwtAudience: [userpoolClient.userPoolClientId],
        jwtIssuer: `https://cognito-idp.${AWS_REGION}.amazonaws.com/${userpool.userPoolId}`,
      }),
      defaultAuthorizationType: sst.ApiAuthorizationType.JWT,
      routes: {
        $default: {
          runtime: 'go1.x',
          srcPath: 'backend',
          handler: 'services/account',
          environment: {
            TABLE_NAME: table.tableName,
          },
        },
      },
    });

    const tablePermissions = new iam.PolicyStatement({
      actions: ['dynamodb:*'],
      effect: iam.Effect.ALLOW,
      resources: [
        `arn:aws:dynamodb:${AWS_REGION}:${AWS_ACCOUNT_ID}:table/${table.tableName}`,
      ],
    });

    api.attachPermissions([tablePermissions]);

    // Show the endpoint in the output
    this.addOutputs({
      AccountApiEndpoint: api.url,
    });
  }
}
