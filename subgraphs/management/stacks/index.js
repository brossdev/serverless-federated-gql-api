import ManagementStack from './Management';

export default function main(app) {
  // Set default runtime for all functions
  app.setDefaultFunctionProps({
    runtime: 'go1.x',
  });

  new ManagementStack(app, 'management');
}
