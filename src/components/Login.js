import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const handleLogin = () => {
    // Logic for handling login/authentication
    // Redirect to home page upon successful login
    // For now, we'll simulate a successful login by redirecting to the home page
    // Replace this with your actual login logic
    // For instance: history.push('/home') if the login is successful
    console.log('Logged in!');
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;
