import * as sst from "@serverless-stack/resources";
import * as iam from "@aws-cdk/aws-iam";
// import { CorsHttpMethod } from "@aws-cdk/aws-apigatewayv2";
import * as apigAuthorizers from "@aws-cdk/aws-apigatewayv2-authorizers";

export default class ManagementStack extends sst.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);

        const AWS_ACCOUNT_ID = sst.Stack.of(this).account
        const AWS_REGION = sst.Stack.of(this).region
        const tableName = process.env.TABLE_NAME;
        const userPoolId = process.env.USERPOOL_ID;
        const userPoolClientId = process.env.USERPOOL_CLIENT_ID;

        const api = new sst.Api(this, "ManagementApi", {
            defaultAuthorizer: new apigAuthorizers.HttpJwtAuthorizer({
                identitySource: ["$request.header.authorization"],
                jwtAudience: [userPoolClientId],
                jwtIssuer: `https://cognito-idp.${AWS_REGION}.amazonaws.com/${userPoolId}`
            }),
            defaultAuthorizationType: sst.ApiAuthorizationType.JWT,
            routes: {
                "$default": {

                    handler: "src",
                    environment: {
                        TABLE_NAME: tableName,
                    }
                }

            }
        });



        const tablePermissions = new iam.PolicyStatement({
            actions: ["dynamodb:*"],
            effect: iam.Effect.ALLOW,
            resources: [
                `arn:aws:dynamodb:${AWS_REGION}:${AWS_ACCOUNT_ID}:table/${tableName}`
            ],
        })

        api.attachPermissions([tablePermissions])

        // Show the endpoint in the output
        this.addOutputs({
            "ApiEndpoint": api.url,
        });
    }
}
