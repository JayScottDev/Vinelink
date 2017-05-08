import React from 'react'
import { Link } from 'react-router-dom'

const Nav = (props) => {
  return (
    <nav className="nav">
    <Link to="/">Home</Link>
    <Link to="/export">Export</Link>
    <Link to="/install">Install Snippet</Link>
    <Link to="/settings">Settings</Link>
    </nav>
  )
}

export default Nav
