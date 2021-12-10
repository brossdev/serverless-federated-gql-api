import React from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import CREATE_ORGANISATION_MUTATION from '../../api/graphql/mutations/createOrganisation';
import type {
  CreateOrganisationInput,
  OrganisationData,
} from '../../api/graphql/mutations/createOrganisation';
import CURRENT_USER_QUERY from '../../api/graphql/queries/currentUser';
import { getErrorMessage } from '../../lib/error-lib';

const CreateOrganisation = () => {
  const [name, setName] = React.useState('');
  const [contactEmail, setContactEmail] = React.useState('');
  const [createOrganisation, { loading, error }] = useMutation<
    OrganisationData,
    CreateOrganisationInput
  >(CREATE_ORGANISATION_MUTATION, {
    refetchQueries: [CURRENT_USER_QUERY],
    awaitRefetchQueries: true,
  });
  const navigate = useNavigate();

  async function handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    //validate email is email here ( and in login/register )
    try {
      await createOrganisation({
        variables: { input: { name, contactEmail } },
      });
      navigate('/settings/organisations');
    } catch (error) {
      const errMessage = getErrorMessage(error);
      return errMessage;
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error...</div>;

  return (
    <div>
      <h2>New Organisation</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Organisation Name</label>
        <input
          id="name"
          placeholder="apple"
          type="text"
          onChange={(e) => setName(e.target.value)}
          value={name}
          required
        />
        <label htmlFor="contactEmail">Contact Email</label>
        <input
          id="contactEmail"
          placeholder="organisation email"
          type="email"
          onChange={(e) => setContactEmail(e.target.value)}
          value={contactEmail}
          required
        />
        <button type="submit">Create Organisation</button>
      </form>
    </div>
  );
};

export default CreateOrganisation;
