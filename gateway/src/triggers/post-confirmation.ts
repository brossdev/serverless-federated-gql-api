import { PostConfirmationTriggerHandler } from "aws-lambda";
import { DynamoDB, PutItemInput } from "@aws-sdk/client-dynamodb";
import { DB_MAP } from "../helpers/db-schema";

export const handler: PostConfirmationTriggerHandler = async (event) => {
  try {
    const tableName = process.env.TABLE_NAME;
    console.log({ req: event.request });
    const {
      email = "test",
      sub,
      firstName = "test",
      lastName = "test",
    } = event.request.userAttributes;
    console.log({ sub });

    const newUserItem = DB_MAP.USER.putInput({
      email,
      sub,
      firstName,
      lastName,
    });

    const newUserInput: PutItemInput = {
      TableName: tableName,
      Item: newUserItem,
    };

    const db = new DynamoDB({ region: "eu-west-1" });

    await db.putItem(newUserInput);

    return event;
  } catch (error) {
    console.log({ error });
    return {
      statusCode: 500,
      body: JSON.stringify(
        { message: "post confirmation trigger has failed", input: event },
        null,
        2
      ),
    };
  }
};
