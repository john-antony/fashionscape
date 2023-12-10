import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/Login.css";
import axios from 'axios';


const Register = () => {
  const navigate = useNavigate();

  const [passwordError, setPasswordError] = useState('');
  const [confirmPass, setConfirmPassword] = useState('');

  const handlePasswordChange = (event) => {
    const {value} = event.target;
    const password = document.getElementById('password').value;

    if (password !== value) {
      setPasswordError('Passwords do not match.');
    } else {
      if (!password && !value) {
        setPasswordError('');
      }
      else {
        setPasswordError('');
        setConfirmPassword(value);
      }
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const password = formData.get('password');
    const confirmPass = formData.get('confirmpass');

    if ( password !== confirmPass) {
      setPasswordError('Passwords do not match!');
      return;
    } else{
      setPasswordError('');
    }

    const userData = {
      email: formData.get('email'),
      name: formData.get('name'),
      username: formData.get('username'),
      password,
    };

    try {
      const response = await axios.post('http://localhost:3001/register', userData);

      if (response.status === 201){
        console.log('Registration successful!');
        navigate('/login');
      }
      else {
        console.error('Registration failed. Try again.');
      }
    }

    catch (error) {
      console.error('Error occurred during registration:', error);
    }
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
          <div>
            <input type="password" id="confirmpass" name="confirmpass" placeholder='Confirm Password' onChange={handlePasswordChange}/>
          </div>
          {passwordError && <p className='error-text'>{passwordError}</p>}
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
