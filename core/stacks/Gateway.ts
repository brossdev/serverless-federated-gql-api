import * as sst from '@serverless-stack/resources';
import * as iam from '@aws-cdk/aws-iam';
import * as cognito from '@aws-cdk/aws-cognito';
import * as ssm from '@aws-cdk/aws-ssm';
import { CorsHttpMethod } from '@aws-cdk/aws-apigatewayv2';
import * as apigAuthorizers from '@aws-cdk/aws-apigatewayv2-authorizers';

interface GatewayStackProps extends sst.StackProps {
  readonly table: sst.Table;
}

export default class GatewayStack extends sst.Stack {
  public readonly api: sst.ApolloApi;

  constructor(scope: sst.App, id: string, props: GatewayStackProps) {
    super(scope, id, props);

    const { table } = props;

    const tablePermissions = new iam.PolicyStatement({
      actions: ['dynamodb:PutItem'],
      effect: iam.Effect.ALLOW,
      resources: [table.tableArn],
    });

    const postConfirmationFunction = new sst.Function(
      this,
      'PostConfirmation',
      {
        handler: 'src/triggers/post-confirmation.handler',
        environment: {
          TABLE_NAME: table.tableName,
        },
      },
    );
    postConfirmationFunction.attachPermissions([tablePermissions]);

    const userPool = new cognito.UserPool(this, 'UserPool', {
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      standardAttributes: {
        familyName: {
          required: true,
          mutable: true,
        },
        givenName: {
          required: true,
          mutable: true,
        },
        email: {
          required: true,
          mutable: true,
        },
      },
      lambdaTriggers: {
        postConfirmation: postConfirmationFunction,
      },
    });

    const userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClient', {
      userPool,
      authFlows: { userSrp: true, custom: true },
    });
    // Create a Apollo GraphQL API
    this.api = new sst.ApolloApi(this, 'FederatedApi', {
      defaultAuthorizer: new apigAuthorizers.HttpUserPoolAuthorizer({
        userPool,
        userPoolClients: [userPoolClient],
      }),
      server: 'src/lambda.handler',
      defaultAuthorizationType: sst.ApiAuthorizationType.JWT,
      cors: {
        allowOrigins: ['http://localhost:3000'],
        allowCredentials: true,
        allowMethods: [CorsHttpMethod.POST, CorsHttpMethod.OPTIONS],
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'authorization',
          'X-Api-Key',
        ],
      },
    });
    new ssm.StringParameter(this, `${this.stackName}-userpool`, {
      parameterName: '/serverless-fed-graphql/userpool',
      description: 'serverless graphql userpool',
      stringValue: userPool.userPoolId,
      type: ssm.ParameterType.STRING,
      tier: ssm.ParameterTier.STANDARD,
      allowedPattern: '.*',
    });

    new ssm.StringParameter(this, `${this.stackName}-userpool-client`, {
      parameterName: '/serverless-fed-graphql/userpool-client',
      description: 'serverless graphql userpool client',
      stringValue: userPoolClient.userPoolClientId,
      type: ssm.ParameterType.STRING,
      tier: ssm.ParameterTier.STANDARD,
      allowedPattern: '.*',
    });
    // Show the endpoint in the output
    this.addOutputs({
      ApiEndpoint: this.api.url,
      UserPoolId: userPool.userPoolId,
      UserPoolClientId: userPoolClient.userPoolClientId,
    });
  }
}
