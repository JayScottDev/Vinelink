import React from 'react';
import { Link } from 'react-router-dom';

const Nav = props => {
  return (
    <section className="nav">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/export">Export</Link>
      <Link to="/install">Install Snippet</Link>
      <Link to="/settings">Settings</Link>
    </section>
  );
};

export default Nav;
