import { gql } from '@apollo/client';

const CurrentUser = gql`
  query {
    getCurrentUser {
      firstName
      lastName
      organisations {
        name
        role
      }
    }
  }
`;

export default CurrentUser;
