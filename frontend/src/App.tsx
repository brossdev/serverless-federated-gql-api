import React from 'react';
import './App.css';

const AuthenticatedApp = React.lazy(/* webpackPrefetch: true */ () => import('./authenticated-app'));
const UnAuthenticatedApp = React.lazy(() => import('./unauthenticated-app'));

function App() {
    const user = false;
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
        <React.Suspense fallback={<div>Loading...</div>}>
        <main>
            {user ? <AuthenticatedApp/> : <UnAuthenticatedApp />}
        </main>
            </React.Suspense>
    </div>
  );
}

export default App;
