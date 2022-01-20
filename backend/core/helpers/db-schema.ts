import { GetItemOutput } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { format } from 'date-fns';

export interface UserOrganisationType {
  name: string;
  keyName: string;
  role: string;
}
export interface UserType {
  email: string;
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  organisations?: UserOrganisationType[];
}

export const DB_MAP = {
  USER: {
    putInput: ({ email, id, firstName, lastName, organisations }: UserType) =>
      marshall({
        PK: `ACCOUNT#${id}`,
        SK: `ACCOUNT#${id}`,
        firstName,
        lastName,
        id,
        email,
        organisations,
        type: 'user',
        createdAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      }),
    getInput: ({ id }: { id: string }) =>
      marshall({
        PK: `ACCOUNT#${id}`,
        SK: `ACCOUNT#${id}`,
      }),
    parse: (getUserOutput: GetItemOutput) => {
      const user = getUserOutput.Item
        ? (unmarshall(getUserOutput.Item) as UserType)
        : null;

      return user;
    },
  },
};
