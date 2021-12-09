import { gql } from '@apollo/client';

export enum BankAccountEnum {
  CURRENT = 'CURRENT',
  SAVINGS = 'SAVINGS',
}

export interface CreatAccountInput {
  input: {
    name: string;
    type: BankAccountEnum;
  };
}

export interface CreateAccountData {
  name: string;
  balance: number;
}

const CreateAccount = gql`
  mutation ($input: BankAccountInput!) {
    createAccount(input: $input) {
      name
      balance
    }
  }
`;

export default CreateAccount;
