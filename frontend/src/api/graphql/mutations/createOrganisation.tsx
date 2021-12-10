import { gql } from '@apollo/client';

export interface CreateOrganisationInput {
  input: {
    name: string;
    contactEmail: string;
  };
}
export interface OrganisationData {
  name: string;
}

const CreateOrganisation = gql`
  mutation ($input: OrganisationInput!) {
    createOrganisation(input: $input) {
      name
    }
  }
`;

export default CreateOrganisation;
