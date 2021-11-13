import React from 'react';
import { Link } from 'react-router-dom'


interface NavLink {
    title: string;
    to: string; 
}

interface NavProps {
    navLinks: NavLink[]
}
const Nav = (props: NavProps) => {

    return (
        <nav>
            <ul>
                {props.navLinks.map(link => <li key={link.title}><Link to={link.to}>{link.title}</Link></li>)}
            </ul>
        </nav>
    )
}

export default Nav;
