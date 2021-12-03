import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const Settings = () => {
  return (
    <div>
      <h2>Settings</h2>
      <nav>
        <ul>
          <li>
            <Link to="organisations">Organisations</Link>
          </li>
        </ul>
      </nav>
      <section>
        <Outlet />
      </section>
    </div>
  );
};

export default Settings;
