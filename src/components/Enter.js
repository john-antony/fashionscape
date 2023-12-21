import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/Enter.css";

const Enter = () => {
  return (
    <div id='enter'>
      <h1 className='title'>Fashionscape</h1>
        <Link to="/login">
          <button className='button'>Enter</button>
        </Link>
    </div>
  );
};

export default Enter;