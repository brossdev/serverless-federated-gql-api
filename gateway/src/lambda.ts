import { gql, ApolloServer } from "apollo-server-lambda";
import { ApolloGateway } from "@apollo/gateway";
import {
    ApolloServerPluginLandingPageGraphQLPlayground
} from "apollo-server-core";

const managementServiceAPI = process.env.MANAGEMENT_SERVICE_API,
const accountServiceAPI = process.env.ACCOUNT_SERVICE_API,

const typeDefs = gql`
  type Query {
      hello: String
  }
  `;

  const resolvers = {
      Query: {
          hello: () => "Hello, World!",
      },
  };


  const gateway = new ApolloGateway({
      serviceList: [
          { name: 'management', url: managementServiceAPI },
          { name: 'account', url: accountServiceAPI }
      ]
  })

  const server = new ApolloServer({
      gateway
      plugins: [
          ApolloServerPluginLandingPageGraphQLPlayground(),
      ],
  });

  export const handler = server.createHandler();
