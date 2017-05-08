import React from 'react'
import { Link } from 'react-router-dom'

const SubNav = ({ match }) => {
  return (
    <div className="sub-nav">
      <h1>Settings</h1>
      <ul>
        <li><Link to={`${match.url}/profile`}>Profile</Link></li>
        <li><Link to={`${match.url}/account`}>Account</Link></li>
        <li><Link to={`${match.url}/notifications`}>Notifications</Link></li>
        <li><Link to={`${match.url}/billing`}>Billing</Link></li>
        <li><Link to={`${match.url}/support`}>Support</Link></li>
        <li><Link to={`${match.url}/faq`}>FAQ</Link></li>
        <li><Link to={`${match.url}/override`}>Override States</Link></li>
        <li><Link to={`${match.url}/status`}>Link Status</Link></li>
      </ul>
    </div>
  )
}

export default SubNav
