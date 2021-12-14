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

  public readonly userPool: cognito.UserPool;

  public readonly userPoolClient: cognito.UserPoolClient;

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

    this.userPool = new cognito.UserPool(this, 'UserPool', {
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

    new cognito.UserPoolResourceServer(this, 'UserPoolResourceServer', {
      identifier: 'https://resource-server/',
      userPoolResourceServerName: `${this.stage}-userpool-resource-server`,
      userPool: this.userPool,
      scopes: [
        {
          scopeDescription: 'organisation admin',
          scopeName: 'org-admin',
        },
        {
          scopeDescription: 'organisation user',
          scopeName: 'org-user',
        },
      ],
    });
    this.userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClient', {
      userPool: this.userPool,
      authFlows: { userSrp: true, custom: true },
      oAuth: {
        flows: {
          implicitCodeGrant: true,
        },
        scopes: [
          cognito.OAuthScope.custom('https://resource-server//org-admin'),
          cognito.OAuthScope.custom('https://resource-server//org-user'),
        ],
      },
    });
    // Create a Apollo GraphQL API
    this.api = new sst.ApolloApi(this, 'FederatedApi', {
      defaultAuthorizer: new apigAuthorizers.HttpUserPoolAuthorizer({
        userPool: this.userPool,
        userPoolClients: [this.userPoolClient],
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
      stringValue: this.userPool.userPoolId,
      type: ssm.ParameterType.STRING,
      tier: ssm.ParameterTier.STANDARD,
      allowedPattern: '.*',
    });

    new ssm.StringParameter(this, `${this.stackName}-userpool-client`, {
      parameterName: '/serverless-fed-graphql/userpool-client',
      description: 'serverless graphql userpool client',
      stringValue: this.userPoolClient.userPoolClientId,
      type: ssm.ParameterType.STRING,
      tier: ssm.ParameterTier.STANDARD,
      allowedPattern: '.*',
    });
    // Show the endpoint in the output
    this.addOutputs({
      ApiEndpoint: this.api.url,
      UserPoolId: this.userPool.userPoolId,
      UserPoolClientId: this.userPoolClient.userPoolClientId,
    });
  }
}
