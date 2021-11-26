import React from 'react';
import Auth from '@aws-amplify/auth';
import { AuthContext } from './contexts/auth-context';
import type { AuthUser } from './contexts/auth-context';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  from,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import './App.css';

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_API_URL,
  credentials: 'include',
});

const authMiddleware = setContext(async (_, { headers }) => {
  const jwtToken = (await Auth.currentSession()).getAccessToken().getJwtToken();
  return {
    headers: {
      ...headers,
      authorization: jwtToken,
    },
  };
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([authMiddleware, httpLink]),
});

const AuthenticatedApp = React.lazy(
  /* webpackPrefetch: true */ () => import('./authenticated-app'),
);
const UnAuthenticatedApp = React.lazy(() => import('./unauthenticated-app'));

function App() {
  const [isAuthenticating, setIsAuthenticating] = React.useState(true);
  const [user, setUser] = React.useState<AuthUser | null>(null);

  async function onLoad() {
    try {
      const authUser = await Auth.currentAuthenticatedUser();
      setUser(authUser);
    } catch (error) {
      if (error !== 'No current User') {
        console.log({ error });
      }
    } finally {
      setIsAuthenticating(false);
    }
  }

  const logout = React.useCallback(() => {
    Auth.signOut();
    setUser(null);
  }, [setUser]);

  React.useEffect(() => {
    onLoad();
  }, []);

  return isAuthenticating ? (
    <div>Loading ...</div>
  ) : (
    <div className="App">
      <React.Suspense fallback={<div>Loading...</div>}>
        <main>
          {user ? (
            <AuthContext.Provider value={{ user }}>
              <ApolloProvider client={client}>
                <AuthenticatedApp logout={logout} />
              </ApolloProvider>
            </AuthContext.Provider>
          ) : (
            <UnAuthenticatedApp />
          )}
        </main>
      </React.Suspense>
    </div>
  );
}

export default App;
