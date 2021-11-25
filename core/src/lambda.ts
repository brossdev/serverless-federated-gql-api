import { ApolloServer } from 'apollo-server-lambda';
import fs from 'fs';
import { ApolloGateway, RemoteGraphQLDataSource } from '@apollo/gateway';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';

const supergraphSdl = fs.readFileSync('../dev-schema.graphql').toString();

const gateway = new ApolloGateway({
  supergraphSdl,
  buildService({ url }) {
    return new RemoteGraphQLDataSource({
      url,
      willSendRequest({ request, context }: { request: any; context: any }) {
        request.http.headers.set('authorization', context?.authorization);
        request.http.headers.set('user', context?.user ?? null);
      },
    });
  },
});

const server = new ApolloServer({
  gateway,
  context: (context) => {
    const sub = context.event.requestContext.authorizer.claims.sub;
    return { user: sub, authorization: context.event.headers.authorization };
  },
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

export const handler = server.createHandler();
