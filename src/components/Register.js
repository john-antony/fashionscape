import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/Login.css";

const Register = () => {
  const handleRegister = () => {
    // Logic for handling user registration
    // For now, we'll simulate a successful registration by redirecting to the login page
    // Replace this with your actual registration logic
    // For instance: history.push('/login') if registration is successful
    console.log('Registered!');
  };

  return (
    <div id='login'>
      <div className='form-container'>
        <h2 className='login-title'>Fashionscape</h2>
        <form onSubmit={handleRegister}>
          <div>
            <input type="email" id="email" name="email" placeholder='Email' />
          </div>
          <div>
            <input type="name" id="name" name="name" placeholder='Full Name' />
          </div>
          <div>
            <input type="text" id="username" name="username" placeholder='Username'/>
          </div>
          <div>
            <input type="password" id="password" name="password" placeholder='Password' />
          </div>
          <button type="submit" className='login-button'>Register</button>
        </form>
      </div>
      <div className='register-form-container'>
        <p>
          Already have an account? <Link to="/login" className='custom-link'>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
