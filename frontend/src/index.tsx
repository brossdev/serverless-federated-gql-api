import React from 'react';
import ReactDOM from 'react-dom';
import { Amplify } from '@aws-amplify/core';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import { ApolloClient, InMemoryCache }

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: process.env.REACT_APP_AWS_REGION,
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_CLIENT_ID,
  },
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
