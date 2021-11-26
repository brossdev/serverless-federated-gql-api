import React from 'react';

const activeAccounts = [
  {
    title: 'current account',
    to: '/organisations',
    balance: 400000,
  },
  {
    title: 'joint account',
    to: '/organisations',
    balance: 400000,
  },
  {
    title: 'savings account',
    to: '/organisations',
    balance: 400000,
  },
];

const AccountSummary = () => (
  <div>
    <h2>Account Summary</h2>
    {activeAccounts.map((account) => (
      <section>
        <h3>{account.title}</h3>
        <h4>{account.balance}</h4>
      </section>
    ))}
  </div>
);

const CustomerSummary = () => (
  <div>
    <h2>Customer Summary</h2>
    {activeAccounts.map((account) => (
      <section>
        <h3>{account.title}</h3>
        <h4>{account.balance}</h4>
      </section>
    ))}
  </div>
);

const Dashboard = () => {
  return (
    <div>
      <p>Your Dashboard</p>
      <AccountSummary />
      <CustomerSummary />
    </div>
  );
};

export default Dashboard;
