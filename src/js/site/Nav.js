import React from 'react';
import { NavLink } from 'react-router-dom';

import '../../styles/nav.scss';

const Nav = props => {
  return (
    <section className="nav">
      <ul className="nav__list nav__list--main">
        <li className="nav__item">
          <NavLink to="/dashboard" activeClassName="nav__active">
            Dashboard
          </NavLink>
        </li>
        <li className="nav__item">
          <NavLink to="/export" activeClassName="nav__active">
            Data export
          </NavLink>
        </li>
      </ul>
      <ul className="nav__list nav__list--secondary">
        <li className="nav__item">
          <NavLink to="/install" activeClassName="nav__active">
            Install snippet
          </NavLink>
        </li>
        <li className="nav__item">
          <NavLink to="/settings" activeClassName="nav__active">
            Settings
          </NavLink>
        </li>
      </ul>
    </section>
  );
};

export default Nav;
