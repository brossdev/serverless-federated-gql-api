import ManagementStack from './Management';
import AccountStack from './Account';

export default function main(app) {
  // Set default runtime for all functions
  app.setDefaultFunctionProps({
    runtime: 'go1.x',
  });

  new ManagementStack(app, 'management-api');
  new AccountStack(app, 'account-api');
}
