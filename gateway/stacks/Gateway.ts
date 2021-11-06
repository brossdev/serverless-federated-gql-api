import * as sst from "@serverless-stack/resources";

export default class GatewayStack extends sst.Stack {
    public readonly api: sst.ApolloApi;
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    // Create a Apollo GraphQL API
     this.api = new sst.ApolloApi(this, "ApolloApi", {
      server: "src/lambda.handler",
      defaultFunctionProps: {
          environment: {
              MANAGEMENT_SERVICE_API: process.env.MANAGEMENT_SERVICE_API,
          }
      }
    });

    // Show the endpoint in the output
    this.addOutputs({
      ApiEndpoint: this.api.url,
    });
  }
}
