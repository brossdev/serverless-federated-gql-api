// import * as sst from "@serverless-stack/resources";
// import * as iam from "@aws-cdk/aws-iam";
// import * as cognito from "@aws-cdk/aws-cognito";
// import * as apigAuthorizers from "@aws-cdk/aws-apigatewayv2-authorizers";

// interface AuthStackProps extends sst.StackProps {
//   readonly apolloGateway: sst.ApolloApi;
//   readonly table: sst.Table;
// }

// export default class AuthStack extends sst.Stack {
//   constructor(scope: sst.App, id: string, props: AuthStackProps) {
//     super(scope, id, props);

//     const { apolloGateway, table } = props;

//     const tablePermissions = new iam.PolicyStatement({
//       actions: ["dynamodb:PutItem"],
//       effect: iam.Effect.ALLOW,
//       resources: [table.tableArn],
//     });

//     const postConfirmationFunction = new sst.Function(
//       this,
//       "PostConfirmation",
//       {
//         handler: "src/triggers/post-confirmation.handler",
//         environment: {
//           TABLE_NAME: table.tableName,
//         },
//       }
//     );

//     postConfirmationFunction.attachPermissions([tablePermissions]);

//     // const userPool = new cognito.UserPool(this, "UserPool", {
//     //     selfSignUpEnabled: true,
//     //     signInAliases: { email: true },
//     //     standardAttributes: {
//     //         familyName: {
//     //             required: true,
//     //             mutable: true,
//     //         },
//     //         givenName: {
//     //             required: true,
//     //             mutable: true,
//     //         },
//     //         email: {
//     //             required: true,
//     //             mutable: true,
//     //         },
//     //     },
//     // lambdaTriggers: {
//     //     postConfirmation: postConfirmationFunction,
//     // },

//     // })

//     // const userPoolClient = new cognito.UserPoolClient(this, "UserPoolClient", {
//     //     userPool,
//     //     authFlows: { userSrp: true, custom: true }
//     // })
// //    const auth = new sst.Auth(this, "Auth", {
// //      cognito: {
// //        userPool: {
// //
// //      },
// //    });

// //    auth.attachPermissionsForAuthUsers([apolloGateway]);
//     // Show the Table Name in the output
//     this.addOutputs({
//       UserPoolID: auth.cognitoUserPool.userPoolId,
//       IdentityPoolId: auth.cognitoCfnIdentityPool.ref,
//       UserPoolClientId: auth.cognitoUserPoolClient.userPoolClientId,
//     });
//   }
// }
