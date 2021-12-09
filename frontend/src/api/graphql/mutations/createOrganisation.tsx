import { gql } from '@apollo/client';

export interface OrganisationInput {
  name: string;
  contactEmail: string;
}

const CreateOrganisation = gql`
  mutation ($input: OrganisationInput!) {
    createOrganisation(input: $input) {
      name
    }
  }
`;

export default CreateOrganisation;
