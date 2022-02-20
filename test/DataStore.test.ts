import { Template } from 'aws-cdk-lib/assertions';
import * as sst from '@serverless-stack/resources';
import DataStore from '../stacks/DataStore';

test('Test Data Store Stack', () => {
  const app = new sst.App();
  // WHEN
  const stack = new DataStore(app, 'test-datastore');

  const template = Template.fromStack(stack);
  // THEN

  template.resourceCountIs('AWS::DynamoDB::Table', 1);
});
