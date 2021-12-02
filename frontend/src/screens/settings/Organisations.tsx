import React from 'react';
import { Link } from 'react-router-dom';

const OrganisationSettings = () => {
  return (
    <div>
      <h2>Organisation Settings</h2>
      <button>
        <Link to="new">New Organisation</Link>
      </button>
    </div>
  );
};

export default OrganisationSettings;
