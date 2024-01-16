import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/Login.css";
import axios from 'axios';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'; // Import Firebase authentication functions
import {auth} from '../firebase.js';
import { useUser } from './UserContext.js';

const Login = () => {
  
  const navigate = useNavigate();
  const { loginUser } = useUser();

  const handleLogin = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const username = formData.get('username');
    const password = formData.get('password');

    try {
      const response = await axios.post('https://fashionscape-backend.onrender.com/login', {username, password});

      if (response.status === 200 && response.data.email) {
        console.log('Response: ', response);
        const {email} = response.data;
        const auth = getAuth();
        await signInWithEmailAndPassword(auth, email, password);
        loginUser({username});
        navigate('/home');
      }
      else {
        console.error('User not found.');
      }
    }
    catch (error) {
      console.error('Login Failed:', error);
    }
  };

  
  return (
    <div id="login">
      <div className='form-container'>
        <Link to='/home' className='login-title-link'>
          <h2 className='login-title'>Fashionscape</h2>
        </Link>
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
