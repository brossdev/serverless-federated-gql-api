import React from 'react';
import { Link } from 'react-router-dom';

interface OrganisationType {
  name: string;
  role: string;
}

interface OrganisationProps {
  organisations: OrganisationType[];
}

const OrganisationSettings = ({ organisations }: OrganisationProps) => {
  return (
    <div>
      <h2>Organisation Settings</h2>
      <button>
        <Link to="new">New Organisation</Link>
      </button>
      <div>List of Organisations</div>
      <section>
        {organisations.map((org) => (
          <div key={org.name}>
            <p>{org.name}</p>
            <p>{org.role}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default OrganisationSettings;
