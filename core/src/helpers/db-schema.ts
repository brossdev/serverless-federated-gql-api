// import { DynamoDB, PutItemInput } from "@aws-sdk/client-dynamodb";
import { marshall } from '@aws-sdk/util-dynamodb';

export interface UserType {
  email: string;
  sub: string;
  firstName: string;
  lastName: string;
}

export const DB_MAP = {
  USER: {
    putInput: ({ email, sub, firstName, lastName }: UserType) =>
      marshall({
        PK: `ACCOUNT#${sub}`,
        SK: `ACCOUNT#${sub}`,
        firstName,
        lastName,
        sub,
        email,
        type: 'user',
      }),
  },
};
