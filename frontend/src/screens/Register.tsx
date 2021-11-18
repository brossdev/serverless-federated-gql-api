import React from "react";
import Auth from "@aws-amplify/auth";
import { getErrorMessage } from "../lib/error-lib";

const Register = () => {
  const [email, setEmail] = React.useState("");
  const [givenName, setGivenName] = React.useState("");
  const [familyName, setFamilyName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [confirmationCode, setConfirmationCode] = React.useState("");
  const [newUser, setNewUser] = React.useState<unknown>(null); // placeholder until i can source amplify types
  const [isLoading, setIsLoading] = React.useState(false);

  const validateForm = () =>
    email.length > 0 &&
    password.length > 0 &&
    password === confirmPassword &&
    familyName !== "" &&
    givenName !== "";

  const validateConfirmationCode = () => confirmationCode.length > 0;

  async function handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const newUser = await Auth.signUp({
        username: email,
        password,
        attributes: {
          given_name: givenName,
          family_name: familyName,
          email,
        },
      });
      setNewUser(newUser);
    } catch (error) {
      const errMessage = getErrorMessage(error);
      if (errMessage === "UsernameExistsException") {
        const user = await Auth.resendSignUp(email);
        setNewUser(user);
      } else {
        return errMessage;
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleConfirmationSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    try {
      await Auth.confirmSignUp(email, confirmationCode);
      await Auth.signIn(email, password);
      // add set user from Auth context in here
    } catch (error) {
      const errMessage = getErrorMessage(error);
      return errMessage;
    } finally {
      setIsLoading(false);
    }
  }

  function renderConfirmationForm() {
    return (
      <form onSubmit={handleConfirmationSubmit}>
        <label htmlFor="confirmationCode">Confirmation Code</label>
        <input
          id="confirmationCode"
          placeholder="code"
          type="tel"
          onChange={(e) => setConfirmationCode(e.target.value)}
          value={confirmationCode}
          required
        />
        <button type="submit" disabled={!validateConfirmationCode()}>
          Verify
        </button>
      </form>
    );
  }

  function renderRegisterForm() {
    return (
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          placeholder="email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />
        <label htmlFor="givenName">First Name</label>
        <input
          id="givenName"
          placeholder="your given name"
          type="text"
          onChange={(e) => setGivenName(e.target.value)}
          value={givenName}
          required
        />
        <label htmlFor="familyName">Family Name</label>
        <input
          id="familyName"
          placeholder="your family name"
          type="text"
          onChange={(e) => setFamilyName(e.target.value)}
          value={familyName}
          required
        />
        <label htmlFor="password">password</label>
        <input
          id="password"
          placeholder="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />
        <label htmlFor="confirmPassword">confirm password</label>
        <input
          id="confirmPassword"
          placeholder="confirm password"
          type="password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
          required
        />
        <button type="submit" disabled={!validateForm()}>
          Register
        </button>
      </form>
    );
  }

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {newUser === null ? renderRegisterForm() : renderConfirmationForm()}
    </div>
  );
};

export default Register;
