import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/Login.css";
import axios from 'axios';

const Login = () => {
  
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const userData = {
      username: formData.get('username'),
      password: formData.get('password'),
    };

    try {
      const response = await axios.post('http://localhost:3001/login', userData);

      if (response.status === 200){
        const token = response.data.token;
        // save token to localStorage
        localStorage.setItem('token', token);
        //redirect or other action after successful login
        navigate('/home');
      }
      else{
        console.error('Login failed. Try again.')
        // handle failed login, display error message 
      }
    }
    catch (error) {
      console.error('Error occurred during login:', error);
    }
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
