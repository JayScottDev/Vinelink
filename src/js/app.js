import React from 'react'
import { Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Install from './pages/Install'
import Settings from './pages/Settings'
import Export from './pages/Export'
import Profile from './pages/Profile'

import Nav from './site/Nav'

const App = (props) => {
  return (
    <div className="app">
      <Nav />
      <div className="app__container">
        <Route exact path="/" component={Home}/>
        <Route path="/settings" component={Settings}/>
        <Route path="/export" component={Export}/>
        <Route path="/install" component={Install} />
      </div>
    </div>
  )
}

export default App
