import React from 'react';
import { Link } from 'react-router-dom';

interface NavLink {
  title: string;
  to: string;
}

interface NavProps {
  navLinks: NavLink[];
  user: { firstName: string; lastName: string };
}
const Nav = (props: NavProps) => {
  const { navLinks, user } = props;
  console.log({ user });
  return (
    <nav>
      <p>Hello {user.firstName}</p>
      <ul>
        {navLinks.map((link) => (
          <li key={link.title}>
            <Link to={link.to}>{link.title}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Nav;
