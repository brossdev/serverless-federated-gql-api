import * as sst from "@serverless-stack/resources";

interface DataStoreProps extends sst.StackProps {
    readonly apolloGateway: sst.ApolloApi;
    readonly table: sst.Table;
}

export default class DataStore extends sst.Stack {
    constructor(scope: sst.App, id: string, props: DataStoreProps) {
        super(scope, id, props);

        const { apolloGateway, table } = props;

        console.log({ table })

        const auth = new sst.Auth(this, "Auth", {
            cognito: {
                userPool: {
                    signInAliases: { email: true },
                }
            }
        });

        auth.attachPermissionsForAuthUsers([apolloGateway]);
        // Show the Table Name in the output
        this.addOutputs({
            UserPoolID: auth.cognitoUserPool.userPoolId,
            IdentityPoolId: auth.cognitoCfnIdentityPool.ref,
            UserPoolClientId: auth.cognitoUserPoolClient.userPoolClientId,
        });
    }
}
