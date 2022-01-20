# Introduction

This project was built as a proof of concept to test building a Federated GraphQL API using AWS Lambda and SST Framework along with some developer tooling i wanted to experiment with. This is not designed to be production ready but does use some useful developer tooling such git hooks and a root level Typescript and Eslint config shared across the stacks.

## In Development

After testing seperate authorisers for the subgraph and gateway, the latency was an issue as expected.  The next step is to replace the HTTP and Userpool authorisers with a shared Lambda Authoriser to take advantage of the token Cacheing across all the Graph's which should improve the performance.


## Technologies in this repository

- [Apollo Federation ( GraphQL )](https://www.apollographql.com/apollo-federation/)
- [Serverless Stack ( SST )](https://serverless-stack.com/)
- [NPM workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces)
- Git Hooks
- Typescript
- Go

## Git Hooks

This project takes advantage of git hooks using Husky. Currently there are two hooks configured in the project

- pre commit - used to run custom eslint and prettier config for consistancy across the full repository
- pre push - used to run Go and JS tests across the repository before allowing push to remote

## Infrastructure

<img width="1244" alt="Screenshot 2021-12-06 at 19 42 16" src="https://user-images.githubusercontent.com/18420698/144911617-650c26cd-f86b-4b57-b50f-c5cbed90ad33.png">

### Core Stack

SST Stack written in typescript, responsible for deploying the core resources of the app

Cognito UserPool
Post Confirmation Lambda handler ( Typescript )
DynamoDB Table
GraphQL Federated Gateway Lambda ( Typescript )


## SubGraph Stack

SST Stack written in Javascript, responsible for deploying each of the federated GraphQL Subgraphs

### Management SubGraph

The Management Subgraph is responsible for handling the account and organisation management for the app. Creation and management of user accoounts and organisation management is handled through this subgraph

GraphQL Federated Management Subgraph Lambda ( Go )

### Account SubGraph

The Account Subgraph is responsible for handling the creation and management of bank accounts and services for the app. 

GraphQL Federated Account Subgraph Lambda ( Go )

### Frontend

Basic React App written in typescript which is connected to the gateway lambda and userpool deployed as part of the core stack.

### Prerequisities

- go 1.17+ installed
- node 14+ installed
- npm 7+ installed

## Running Locally

Using the SST Framework we can run the gateway and all subgraphs locally. As we don't know the subgraph routing url's ahead of time, we need to deploy the core app with placeholder subgraph urls on first deployment

From the root directory

```bash
$ npm install
$ npm run core
```

in a new terminal window

```bash
$ npm run subgraphs
```

After both subgraphs are running, take note of the AccountApiEndpoint and ManagementApiEndpoint output in the console window. Paste the management api into the routing url of the supergraph config, do the same with the account Endpoint and then restart the core service.

in the frontend repository add a `.env.local` file with the following proporties taken from the output of the core deployment

```bash
REACT_APP_API_URL=
REACT_APP_AWS_REGION=
REACT_APP_USER_POOL_ID=
REACT_APP_CLIENT_ID=
SKIP_PREFLIGHT_CHECK=true
```

```bash
$ npm run core
```

in a seperate terminal window

```bash
$ npm run frontend
```

All components of the app should now be running locally.
