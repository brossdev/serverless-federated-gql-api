import * as sst from '@serverless-stack/resources';
import * as iam from '@aws-cdk/aws-iam';
import * as ssm from '@aws-cdk/aws-ssm';
import * as apigAuthorizers from '@aws-cdk/aws-apigatewayv2-authorizers';

export default class ManagementStack extends sst.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const AWS_ACCOUNT_ID = sst.Stack.of(this).account;
    const AWS_REGION = sst.Stack.of(this).region;
    //
    const tableName = ssm.StringParameter.fromStringParameterAttributes(
      this,
      'tablename',
      {
        parameterName: '/serverless-fed-graphql/database',
      },
    );

    const userPoolId = ssm.StringParameter.fromStringParameterAttributes(
      this,
      'userPoolId',
      {
        parameterName: '/serverless-fed-graphql/userpool',
      },
    );

    const userPoolClientId = ssm.StringParameter.fromStringParameterAttributes(
      this,
      'userPoolClientId',
      {
        parameterName: '/serverless-fed-graphql/userpool-client',
      },
    );

    const api = new sst.Api(this, 'ManagementApi', {
      defaultAuthorizer: new apigAuthorizers.HttpJwtAuthorizer({
        identitySource: ['$request.header.authorization'],
        jwtAudience: [userPoolClientId.stringValue],
        jwtIssuer: `https://cognito-idp.${AWS_REGION}.amazonaws.com/${userPoolId.stringValue}`,
      }),
      defaultAuthorizationType: sst.ApiAuthorizationType.JWT,
      routes: {
        $default: {
          handler: 'src/management',
          environment: {
            TABLE_NAME: tableName.stringValue,
          },
        },
      },
    });

    const tablePermissions = new iam.PolicyStatement({
      actions: ['dynamodb:*'],
      effect: iam.Effect.ALLOW,
      resources: [
        `arn:aws:dynamodb:${AWS_REGION}:${AWS_ACCOUNT_ID}:table/${tableName.stringValue}`,
      ],
    });

    api.attachPermissions([tablePermissions]);

    // Show the endpoint in the output
    this.addOutputs({
      ManagementApiEndpoint: api.url,
    });
  }
}
