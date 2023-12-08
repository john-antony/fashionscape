import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';

const Home = () => {
  return (
    <div id='home'>
      <div className='nav-bar'>
        <Link to="/home" className='home-link'>
          <h1 className='fashionscape-home'>Fashionscape</h1>
        </Link>
        <div className='input-searchbar'>
          <SearchOutlinedIcon className='search-icon'/>
          <input type='text' id='searchbar' name='searchbar' placeholder='Search'className='input-searchbar'/>
          <Link to="/chat">
            <ChatBubbleIcon className='chat-icon'/>
          </Link>
          <Link to="/likes">
            <FavoriteIcon className='like-icon'/>
          </Link>
          <Link to="/profile">
            <PersonIcon className='profile-icon'/>          
          </Link>
        </div>
      </div>

      <div className='feed-container'>
        <ul className='feed-grid'>
          <li className='feed-card'>
            <img src='C:\Users\janto\fashionscape\public\assets\concrete2.jpg' alt=''/>            
          </li>
        </ul>
      </div>

    </div>
  );
};

export default Home;
