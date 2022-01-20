import { expect, haveResource } from '@aws-cdk/assert';
import * as sst from '@serverless-stack/resources';
import DataStore from '../stacks/DataStore';

test('Test Data Store Stack', () => {
  const app = new sst.App();
  // WHEN
  const stack = new DataStore(app, 'test-datastore');
  // THEN
  expect(stack).to(haveResource('AWS::DynamoDB::Table'));
});
