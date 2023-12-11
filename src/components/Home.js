import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
// import Masonry from 'masonry-layout';
// import imagesLoaded from 'imagesloaded';
import Masonry from './Masonry.js';

const Home = ({images}) => {

  return (
    <div id='home'>
      <div className='nav-bar'>
        <Link to="/" className='home-link'>
          <h1 className='fashionscape-home'>Fashionscape</h1>
        </Link>
        <div className='input-searchbar'>
          <SearchOutlinedIcon className='search-icon'/>
          <input type='text' id='searchbar' name='searchbar' placeholder='Search'className='input-searchbar'/>
          <div className='menu-icons'>
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
      </div>
      {/* <img src={`${process.env.PUBLIC_URL}/fits/archivepillar.jpg`} /> */}
      <div className='masonry'>
        <Masonry imageUrls={images} columnCount='6' gap="5"></Masonry>
      </div>
    </div>
  );
};

export default Home;
