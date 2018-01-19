import React from 'react'
import { Route, Link } from 'react-router-dom'
import Profile from './Profile'
import Account from './Account'
import Notifications from './Notifications'
import Billing from './Billing'
import Support from './Support'
import Faq from './Faq'
import Override from './Override'
import Status from './Status'
import SubNav from '../Components/SubNav'


const Settings = (props) => {
  const { match } = props
  return (
    <div className="settings">
      <SubNav match={match} />
      <div className="settings__content">
        <Route path={`${match.url}/profile`} component={Profile}/>
        <Route path={`${match.url}/account`} component={Account}/>
        <Route path={`${match.url}/notifications`} component={Notifications}/>
        <Route path={`${match.url}/billing`} component={Billing}/>
        <Route path={`${match.url}/support`} component={Support}/>
        <Route path={`${match.url}/faq`} component={Faq}/>
        <Route path={`${match.url}/override`} component={Override}/>
        <Route path={`${match.url}/status`} component={Status}/>
      </div>
    </div>
  )
}

export default Settings
