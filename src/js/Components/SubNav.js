import React from 'react';
import { Link } from 'react-router-dom';

import '../../styles/subnav.scss';

const SubNav = ({ match }) => {
  return (
    <div className="sub-nav">
      <ul className="sub-nav__list">
        <li className="sub-nav__item">
          <Link to={`${match.url}/profile`}>Profile</Link>
        </li>
        <li className="sub-nav__item">
          <Link to={`${match.url}/account`}>Account</Link>
        </li>
        <li className="sub-nav__item">
          <Link to={`${match.url}/notifications`}>Notifications</Link>
        </li>
        <li className="sub-nav__item">
          <Link to={`${match.url}/billing`}>Billing</Link>
        </li>
        <li className="sub-nav__item">
          <Link to={`${match.url}/support`}>Support</Link>
        </li>
        <li className="sub-nav__item">
          <Link to={`${match.url}/faq`}>FAQ</Link>
        </li>
        <li className="sub-nav__item">
          <Link to={`${match.url}/override`}>Override States</Link>
        </li>
        <li className="sub-nav__item">
          <Link to={`${match.url}/status`}>Link Status</Link>
        </li>
      </ul>
    </div>
  );
};

export default SubNav;
