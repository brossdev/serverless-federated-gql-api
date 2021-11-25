import * as sst from '@serverless-stack/resources';

interface StaticSiteProps extends sst.StackProps {
  readonly api: sst.ApolloApi;
}

export default class StaticSiteStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props: StaticSiteProps) {
    super(scope, id, props);

    const { api } = props;
    const site = new sst.ReactStaticSite(this, 'ReactSite', {
      path: '../frontend',
      environment: {
        // Pass in the API endpoint to our app
        REACT_APP_API_URL: api.url,
      },
    });

    this.addOutputs({
      siteUrl: site.url,
    });
  }
}
