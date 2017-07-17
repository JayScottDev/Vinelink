import React from 'react';

const Login = props => {
  return (
    <div className="login">
      <h1>Login</h1>
      <form>
        <input type="text" name="username" placeholder="username" />
        <input type="password" name="password" placeholder="password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
