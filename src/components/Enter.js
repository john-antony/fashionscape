import React from 'react';
import { Link } from 'react-router-dom';

const Enter = () => {
  return (
    <div>
      <h1>Fashionscape</h1>
      <Link to="/login">
        <button>Enter</button>
      </Link>
    </div>
  );
};

export default Enter;