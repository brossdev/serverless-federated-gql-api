import { expect, haveResource } from '@aws-cdk/assert';
import * as sst from '@serverless-stack/resources';
import MyStack from '../stacks/Account';

test('Test Stack', () => {
  const app = new sst.App();
  app.setDefaultFunctionProps({
    runtime: 'go1.x',
  });
  // WHEN
  const stack = new MyStack(app, 'test-stack');
  // THEN
  expect(stack).to(haveResource('AWS::Lambda::Function'));
});
