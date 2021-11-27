import React from 'react';

const activeAccounts = [
  {
    title: 'current account',
    to: '/organisations',
    balance: 400000,
  },
  {
    title: 'suppliers',
    to: '/organisations',
    balance: 400000,
  },
  {
    title: 'savings account',
    to: '/organisations',
    balance: 400000,
  },
];

const BookingSummary = () => (
  <div>
    <h2>Booking Summary</h2>
    {activeAccounts.map((account) => (
      <section>
        <h3>{account.title}</h3>
        <h4>{account.balance}</h4>
      </section>
    ))}
  </div>
);

const AccountSummary = () => (
  <div>
    <h2>Financial Summary</h2>
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

const VendorSummary = () => (
  <div>
    <h2>Vendor Summary</h2>
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
      <BookingSummary />
      <AccountSummary />
      <CustomerSummary />
      <VendorSummary />
    </div>
  );
};

export default Dashboard;
