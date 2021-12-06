import { marshall } from '@aws-sdk/util-dynamodb';
import { format } from 'date-fns';

export interface UserType {
  email: string;
  id: string;
  firstName: string;
  lastName: string;
}

export const DB_MAP = {
  USER: {
    putInput: ({ email, id, firstName, lastName }: UserType) =>
      marshall({
        PK: `ACCOUNT#${id}`,
        SK: `ACCOUNT#${id}`,
        firstName,
        lastName,
        id,
        email,
        type: 'user',
        createdAt: format(new Date(), 'YYYY-MM-dd HH:mm:ss'),
      }),
  },
};
