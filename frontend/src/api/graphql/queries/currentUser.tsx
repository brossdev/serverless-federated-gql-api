import { gql } from '@apollo/client';

const CurrentUser = gql`
  query {
    getCurrentUser {
      firstName
      lastName
    }
  }
`;

export default CurrentUser;
