import * as sst from "@serverless-stack/resources";

export default class DataStore extends sst.Stack {
  public readonly table: sst.Table;
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    this.table = new sst.Table(this, "database", {
      fields: {
        PK: sst.TableFieldType.STRING,
        SK: sst.TableFieldType.STRING,
      },
      primaryIndex: { partitionKey: "PK", sortKey: "SK" },
    });
    // Show the Table Name in the output
    this.addOutputs({
      TableName: this.table.tableName,
    });
  }
}
