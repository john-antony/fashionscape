import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  const handleRegister = () => {
    // Logic for handling user registration
    // For now, we'll simulate a successful registration by redirecting to the login page
    // Replace this with your actual registration logic
    // For instance: history.push('/login') if registration is successful
    console.log('Registered!');
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" />
        </div>
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;
