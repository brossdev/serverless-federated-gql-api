import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import Nav from './components/Nav';
import Dashboard from './screens/Dashboard';
import Customers from './screens/Customers';
import Accounts from './screens/Accounts';
import Vendors from './screens/Vendors';
import Schedule from './screens/Schedule';

import CURRENT_USER_QUERY from './api/graphql/queries/currentUser';

type AuthAppProps = {
  logout(): void;
};

const navLinks = [
  {
    title: 'schedule',
    to: '/schedule',
  },
  {
    title: 'accounts',
    to: '/accounts',
  },
  { title: 'customers', to: '/customers' },
  { title: 'vendors', to: '/vendors' },
];

const AuthenticatedApp = ({ logout }: AuthAppProps) => {
  const { loading, data: user, error } = useQuery(CURRENT_USER_QUERY);

  if (loading) return <p>Loading ...</p>;
  if (error) return <p>Error :( </p>;

  return (
    <BrowserRouter>
      <Nav navLinks={navLinks} user={user.getCurrentUser} logout={logout} />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/vendors" element={<Vendors />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AuthenticatedApp;
