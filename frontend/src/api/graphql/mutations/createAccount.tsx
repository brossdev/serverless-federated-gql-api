import { gql } from '@apollo/client';

const CreateAccount = gql`
  mutation ($input: AccountInput!) {
    createAccount(input: $input) {
      name
      balance
      number
    }
  }
`;

export default CreateAccount;
