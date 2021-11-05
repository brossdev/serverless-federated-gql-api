import * as sst from "@serverless-stack/resources";
import DataStoreStack from "./DataStore";
import GatewayStack from "./Gateway";

export default function main(app: sst.App): void {
  // Set default runtime for all functions
  app.setDefaultFunctionProps({
      runtime: "nodejs14.x",
  });
    
  new DataStoreStack(app, "data-store")
  new GatewayStack(app, "gateway");

}
