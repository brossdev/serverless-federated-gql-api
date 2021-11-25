import React from 'react';

export const AuthContext = React.createContext(null);

export function useAuthContext() {
  return React.useContext(AuthContext);
}
