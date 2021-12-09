import React from 'react';
import { Link, Outlet } from 'react-router-dom';

interface AccountType {
  name: string;
  number: string;
  balance: number;
}

interface AccountProps {
  accounts: AccountType[];
}

const Accounts = ({ accounts }: AccountProps) => {
  return (
    <div>
      <h2>Your Accounts</h2>
      <button>
        <Link to="new">Open Account</Link>
      </button>
      <div>List of Your Accounts</div>
      <section>
        {accounts?.map((account) => (
          <div key={account.number}>
            <p>{account.name}</p>
            <p>{account.balance}</p>
          </div>
        ))}
      </section>
      <section>
        <Outlet />
      </section>
    </div>
  );
};

export default Accounts;
