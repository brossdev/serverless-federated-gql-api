import React from "react";
import Auth from "@aws-amplify/auth";
import { AuthContext } from "./contexts/auth-context";
import "./App.css";

const AuthenticatedApp = React.lazy(
  /* webpackPrefetch: true */ () => import("./authenticated-app")
);
const UnAuthenticatedApp = React.lazy(() => import("./unauthenticated-app"));

function App() {
  const [isAuthenticating, setIsAuthenticating] = React.useState(true);
  const [user, setUser] = React.useState(null);

  async function onLoad() {
    try {
      const authUser = await Auth.currentAuthenticatedUser();
      setUser(authUser);
    } catch (error) {
      if (error !== "No current User") {
        console.log({ error });
      }
    } finally {
      setIsAuthenticating(false);
    }
  }

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
            <AuthContext.Provider value={user}>
              <AuthenticatedApp />
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
