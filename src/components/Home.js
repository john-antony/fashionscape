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

const Home = () => {

  const images = [
    {
      url: 'archivepillar.jpg',
      alt: 'archive pillar',
      title: 'Title of Image 1',
      description: 'Description of Image 1',
    },
    {
      url: 'Bottega Veneta Fall 2023 Milan - Fashionably Male.jpg',
      alt: 'Bottega',
      title: 'Title of Image 2',
      description: 'Description of Image 2',
    },
    {
      url: 'Junya Watanabe Fall 2006 Ready-to-Wear Fashion Show.jpg',
      alt: 'Junya',
      title: 'Title of Image 2',
      description: 'Description of Image 2',
    },
    {
      url: 'PAF.jpg',
      alt: 'PAF',
      title: 'Title of Image 2',
      description: 'Description of Image 2',
    },
    {
      url: 'CDG.jpg',
      alt: 'CDG',
      title: 'Title of Image 2',
      description: 'Description of Image 2',
    },
    {
      url: 'Rick Owens Spring 2011 Menswear Fashion Show.jpg',
      alt: 'Rick Owens',
      title: 'Title of Image 2',
      description: 'Description of Image 2',
    },
    {
      url: 'Yohji Yamamoto _ Menswear - Autumn 2020 _ Look 12.jpg',
      alt: 'Yohji Yamamoto',
      title: 'Title of Image 2',
      description: 'Description of Image 2',
    },]
  
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
