import * as sst from "@serverless-stack/resources";

export default class ManagementStack extends sst.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // Create a HTTP API
    const api = new sst.Api(this, "ManagementApi", {
      routes: {
        "$default": "src",
      }
    });

      const auth = new sst.Auth(this, "Auth", {
          cognito: {
              userPool: {
                  signInAliases: { email: true },  
              },
              triggers: {
                  postConfirmation: "src/"
              }
              
          }
      })

    // Show the endpoint in the output
    this.addOutputs({
      "ApiEndpoint": api.url,
    });
  }
}
