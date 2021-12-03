import { gql } from '@apollo/client';

const CreateOrganisation = gql`
  mutation ($input: OrganisationInput!) {
    createOrganisation(input: $input) {
      name
    }
  }
`;

export default CreateOrganisation;
