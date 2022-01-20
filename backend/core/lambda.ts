import { ApolloServer } from 'apollo-server-lambda';
import fs from 'fs';
import {
  ApolloGateway,
  RemoteGraphQLDataSource,
  GraphQLDataSourceProcessOptions,
} from '@apollo/gateway';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';

const supergraphSdl = fs.readFileSync('../dev-schema.graphql').toString();

type CoreGatewayDataSourceParams = GraphQLDataSourceProcessOptions & {
  context: {
    authorization: string;
    user: string;
  };
};

const gateway = new ApolloGateway({
  supergraphSdl,
  buildService({ url }) {
    return new RemoteGraphQLDataSource({
      url,
      willSendRequest({ request, context }: CoreGatewayDataSourceParams) {
        request.http?.headers.set('authorization', context.authorization);
        request.http?.headers.set('user', context?.user ?? null);
      },
    });
  },
});

const server = new ApolloServer({
  gateway,
  context: (context) => {
    const sub: string = context.event.requestContext.authorizer.claims.sub;
    return { user: sub, authorization: context.event.headers.authorization };
  },
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

export const handler = server.createHandler();
