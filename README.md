# Introduction

This project was built as a proof of concept to test building a Federated GraphQL API using AWS Lambda and SST Framework along with some developer tooling i wanted to experiment with.  This is not designed to be production ready but does use some useful developer tooling such git hooks and a root level Typescript and Eslint config shared across the stacks.

## Technologies in this repository
- Apollo Federation ( GraphQL )
- Serverless Stack ( SST )
- NPM workspaces
- Git Hooks
- Typescript
- Go

## Infrastructure

Diagram to follow

### Core Stack
SST Stack written in typescript, responsible for deploying the core resources of the app

### Management SubGraph
SST stack responsible for deploying a GraphQL Federated API written in Go

### Account SubGraph
SST stack responsible for deploying a GraphQL Federated API written in Go

### Frontend
Basic React App written in typescript which is connected to the gateway lambda and userpool deploayed as part of the core stack. 

### Prerequisities

go 1.17+ installed
node 14+ installed
npm 7+ installed

## Running Locally

Using the SST Framework we can run the gateway and all subgraphs locally.  As we don't know the subgraph routing url's ahead of time, we need to deploy the core app with placeholder subgraph urls on first deployment


From the root directory

```bash
$ npm install
$ npm run core
``````

in a new terminal window

```bash
$ npm run subgraph:management
``````

in a seperate window run the commands below

```bash
$ npm run subgraph:account
``````

After both subgraphs are running, take note of the Api Endpoint output in the console window for each.  Paste the management api into the routing url of the supergraph config, do the same with the account Endpoint and then restart the core service.

in the frontend repository add a ```.env.local``` file with the following proporties taken from the output of the core deployment

```bash
REACT_APP_API_URL=
REACT_APP_AWS_REGION=
REACT_APP_USER_POOL_ID=
REACT_APP_CLIENT_ID=
```

```bash
$ npm run core
``````

in a fourth terminal window

```bash
$ npm run frontend
```

All components of the app should now be running locally. 
