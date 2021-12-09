import * as sst from '@serverless-stack/resources';
import DataStoreStack from './DataStore';
import GatewayStack from './Gateway';
import StaticSiteStack from './StaticSite';

export default function main(app: sst.App): void {
  // Set default runtime for all functions
  app.setDefaultFunctionProps({
    runtime: 'nodejs14.x',
  });

  const dataStore = new DataStoreStack(app, 'data-store');
  const gateway = new GatewayStack(app, 'gateway', {
    table: dataStore.table,
  });

  new StaticSiteStack(app, 'frontend', {
    api: gateway.api,
    userPool: gateway.userPool,
    userPoolClient: gateway.userPoolClient,
  });
}
