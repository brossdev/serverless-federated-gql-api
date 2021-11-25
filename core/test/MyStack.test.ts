import { expect, haveResource } from '@aws-cdk/assert';
import * as sst from '@serverless-stack/resources';
import GatewayStack from '../stacks/Gateway';

test('Test Gateway Stack', () => {
  const app = new sst.App();
  // WHEN
  const stack = new GatewayStack(app, 'test-stack', {
    table: 'test-table',
  });
  // THEN
  expect(stack).to(haveResource('AWS::Lambda::Function'));
});
