# Introduction

This project was built as a proof of concept to test building a Federated GraphQL API using AWS Lambda and SST Framework.

## Infrastructure

insert diagram

add introduction of each part and subgraphs

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


```bash
$ npm run core
``````

in a fourth terminal window

```bash
$ npm run frontend
```

All components of the app should now be running locally. 
