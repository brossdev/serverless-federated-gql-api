import { gql, ApolloServer } from "apollo-server-lambda";
import {
    ApolloServerPluginLandingPageGraphQLPlayground
} from "apollo-server-core";


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

  const server = new ApolloServer({
      typeDefs,
      resolvers,
      plugins: [
          ApolloServerPluginLandingPageGraphQLPlayground(),
      ],
  });

  export const handler = server.createHandler();
