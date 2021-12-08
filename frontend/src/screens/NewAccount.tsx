import React from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import CREATE_ACCOUNT_MUTATION from '../api/graphql/mutations/createAccount';
import CURRENT_USER_QUERY from '../api/graphql/queries/currentUser';
import { getErrorMessage } from '../lib/error-lib';

type AccountTypes = 'current' | 'savings';

type AccountTypeElement = HTMLSelectElement & {
  value: AccountTypes;
};

const CreateAccount = () => {
  const [name, setName] = React.useState('');
  const [type, setType] = React.useState<AccountTypes | undefined>();
  const [createAccount, { loading, error }] = useMutation(
    CREATE_ACCOUNT_MUTATION,
    {
      refetchQueries: [CURRENT_USER_QUERY],
      awaitRefetchQueries: true,
    },
  );
  const navigate = useNavigate();

  async function handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    try {
      await createAccount({
        variables: { input: { name, type } },
      });
      navigate('/accounts');
    } catch (error) {
      const errMessage = getErrorMessage(error);
      return errMessage;
    }
  }

  async function handleAccountChange(
    event: React.ChangeEvent<AccountTypeElement>,
  ) {
    event.preventDefault();
    const selection = event.target.value;
    setType(selection);
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error...</div>;

  return (
    <div>
      <h2>New Account</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Account Name</label>
        <input
          id="name"
          placeholder="my current account"
          type="text"
          onChange={(e) => setName(e.target.value)}
          value={name}
          required
        />
        <label htmlFor="type">Account Type</label>
        <select id="type" defaultValue="current" onChange={handleAccountChange}>
          <option value={'current'}>Current</option>
          <option value={'savings'}>Savings</option>
        </select>
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
};

export default CreateAccount;
