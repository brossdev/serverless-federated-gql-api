import * as sst from "@serverless-stack/resources";
import AuthStack from "./Auth";
import DataStoreStack from "./DataStore";
import GatewayStack from "./Gateway";

export default function main(app: sst.App): void {
  // Set default runtime for all functions
  app.setDefaultFunctionProps({
    runtime: "nodejs14.x",
  });

  const dataStore = new DataStoreStack(app, "data-store");
  const gateway = new GatewayStack(app, "gateway");
  new AuthStack(app, "auth", {
    apolloGateway: gateway.api,
    table: dataStore.table,
  });
}
