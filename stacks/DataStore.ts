import * as sst from '@serverless-stack/resources';
import * as ssm from 'aws-cdk-lib/aws-ssm';

export default class DataStore extends sst.Stack {
  public readonly table: sst.Table;

  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    this.table = new sst.Table(this, 'database', {
      fields: {
        PK: sst.TableFieldType.STRING,
        SK: sst.TableFieldType.STRING,
      },
      primaryIndex: { partitionKey: 'PK', sortKey: 'SK' },
    });

    new ssm.StringParameter(this, `${this.stackName}-database`, {
      parameterName: '/gql-federation/database',
      description: 'serverless graphql database',
      stringValue: this.table.tableName,
      type: ssm.ParameterType.STRING,
      tier: ssm.ParameterTier.STANDARD,
      allowedPattern: '.*',
    });
    // Show the Table Name in the output
    this.addOutputs({
      TableName: this.table.tableName,
    });
  }
}
