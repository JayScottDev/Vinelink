import React from 'react'
import { Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Install from './pages/Install'
import Settings from './pages/Settings'
import Export from './pages/Export'
import Profile from './pages/Profile'

import Nav from './site/Nav'

const App = ({ match }) => {
  console.log('props', match);
  return (
    <div className="app">
      <Nav />
      <div className="app__container">
        <Route exact path="/dashboard" component={Dashboard}/>
        <Route path="/settings" component={Settings}/>
        <Route path="/export" component={Export}/>
        <Route path="/install" component={Install} />
      </div>
    </div>
  )
}

export default App
