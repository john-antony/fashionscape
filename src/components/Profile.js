import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import AddCircleIcon from '@mui/icons-material/AddCircle';


const Profile = () => {
    return (
        <div id='home'>
            <div className='nav-bar'>
            <Link to="/home" className='home-link'>
                <h1 className='fashionscape-home'>Fashionscape</h1>
            </Link>
            <div className='input-searchbar'>
                <SearchOutlinedIcon className='search-icon'/>
                <input type='text' id='searchbar' name='searchbar' placeholder='Search'className='input-searchbar'/>
                <Link to="/create">
                        <AddCircleIcon className='add-icon'/>
                    </Link>
                <Link to="/Chat">
                    <ChatBubbleIcon className='chat-icon'/>
                </Link>
                <Link to="/Likes">
                    <FavoriteIcon className='like-icon'/>
                </Link>
                <Link to="/Profile">
                    <PersonIcon className='profile-icon'/>          
                </Link>
            </div>
            </div>
        </div>

    );
};


export default Profile;