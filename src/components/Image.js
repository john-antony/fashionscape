import React from 'react';
import { Link, useParams } from 'react-router-dom';
import '../styles/Home.css';
import '../styles/Image.css';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import AddCircleIcon from '@mui/icons-material/AddCircle';


const Image = ({images}) => {

    const {imageId} = useParams();

    const selectedImage = images[parseInt(imageId, 10)];

    if (!selectedImage) {
        return <div>Image not found</div>;
    }
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
                    </Link>0
                </div>
            </div>
            <div className='centered-image'>
                <img src={`${process.env.PUBLIC_URL}/fits/${selectedImage.url}`} alt="" className='image-proportions'></img>
            </div>
        </div>
    );
};


export default Image;