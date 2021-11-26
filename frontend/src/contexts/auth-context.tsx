import React from 'react';
import { CognitoUser } from '@aws-amplify/auth';

export type AuthChallengeName =
  | 'NEW_PASSWORD_REQUIRED'
  | 'SMS_MFA'
  | 'SOFTWARE_TOKEN_MFA'
  | 'MFA_SETUP';

export type AuthUser = CognitoUser & {
  challengeName: AuthChallengeName;
  challengeParam: Record<string, unknown>;
};

interface IAuthContext {
  user: AuthUser | null;
}

export type ContextValue = undefined | IAuthContext;
export const AuthContext = React.createContext<ContextValue>(undefined);

export function useAuthContext() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuthContext must be used within a AuthProvider`);
  }
  return context;
}
