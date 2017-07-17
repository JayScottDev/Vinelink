import React from 'react';
import { Link } from 'react-router-dom';

const Landing = props => {
  console.log(props);
  return (
    <div className="landing">
      <h1>VineLink</h1>
      <button>
        <Link to="/Login">Login</Link>
      </button>
      <button>
        <Link to="/Sighup">Login</Link>
      </button>
    </div>
  );
};

export default Landing;
