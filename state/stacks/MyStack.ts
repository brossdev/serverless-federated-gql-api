import * as sst from "@serverless-stack/resources";

export default class DataStore extends sst.Stack {
    constructor(scope: sst.App, id: string, props?: sst.StackProps) {
        super(scope, id, props);

        const table = new sst.Table(this, "sls-gql", {
            fields: {
                PK: sst.TableFieldType.STRING,
                SK: sst.TableFieldType.STRING,
            },
            primaryIndex: { partitionKey: "PK", sortKey: "SK" }
        });
        // Show the Table Name in the output
        this.addOutputs({
            "TableName": table.tableName,
        });
    }
}
