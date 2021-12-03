import { marshall } from '@aws-sdk/util-dynamodb';
import { format } from 'date-fns';

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
        createdAt: format(new Date(), 'YYYY-MM-dd HH:mm:ss'),
      }),
  },
};
