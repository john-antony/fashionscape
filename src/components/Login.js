import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/Login.css";

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
    <div id="login">
      <div className='form-container'>
        <h2 className='login-title'>Fashionscape</h2>
        <form onSubmit={handleLogin}>
          <div className='form-text-box'>
            <input type="text" id="username" name="username" placeholder='Username'/>
          </div>
          <div className='form-text-box'>
            <input type="password" id="password" name="password" placeholder='Password'/>
          </div>
          <button className='login-button' type="submit">Login</button>
        </form>
      </div>
      <div className='register-form-container'>
      <p>
          Don't have an account? <Link to="/register" className='custom-link'>Register</Link>
      </p>
      </div>
    </div>
  );
};

export default Login;
