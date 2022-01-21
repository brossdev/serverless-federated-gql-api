import React from 'react';
import { Auth } from '@aws-amplify/auth';

const Login = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    Auth.signIn(email, password);
  }

  if (error) return <div>Error, something is broken</div>;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          value={email}
          placeholder="email"
          type="email"
          required
          onChange={(e) => {
            setEmail(e.target.value.toLowerCase());
          }}
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          value={password}
          placeholder="password"
          type="password"
          required
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button type="submit" disabled={!validateForm()}>
          {isLoading ? <div>Loading Placeholder ....</div> : <div>SignIn</div>}
        </button>
      </form>
    </div>
  );
};

export default Login;
