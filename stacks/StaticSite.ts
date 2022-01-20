import * as sst from '@serverless-stack/resources';
import * as cognito from '@aws-cdk/aws-cognito';

interface StaticSiteProps extends sst.StackProps {
  readonly api: sst.ApolloApi;
  readonly userPool: cognito.UserPool;
  readonly userPoolClient: cognito.UserPoolClient;
}

export default class StaticSiteStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props: StaticSiteProps) {
    super(scope, id, props);

    const { api, userPool, userPoolClient } = props;
    const site = new sst.ReactStaticSite(this, 'ReactSite', {
      path: '../frontend',
      environment: {
        // Pass in the API endpoint to our app
        REACT_APP_API_URL: api.url,
        REACT_APP_USER_POOL_ID: userPool.userPoolId,
        REACT_APP_CLIENT_ID: userPoolClient.userPoolClientId,
      },
    });

    this.addOutputs({
      siteUrl: site.url,
    });
  }
}
