import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Masonry from './Masonry';
import axios from 'axios';
import { useUser } from './UserContext';



const Likes = () => {

    const { user } = useUser();
    const [likedImages, setLikedImages] = useState([]);

    useEffect(() => {
        async function fetchLikedImages() {
            if (user && user.username) {
                try {
                    const response = await axios.get(`http://localhost:3001/likedimages/${user.username}`);
                    if (response.status === 200) {
                        const { likedImages } = response.data;
                        // Transform the likedImages array into objects with imageURL property
                        const formattedLikedImages = likedImages.map(imageURL => ({ imageURL }));
                        setLikedImages(formattedLikedImages);
                        console.log(formattedLikedImages);
                    }
                } 
                catch (error) {
                    console.error('Error fetching liked images:', error);
                }
            }
        }
    
        fetchLikedImages();
    }, [user]);

    return (
        <div id='home'>
            <div className='nav-bar'>
                <Link to="/home" className='home-link'>
                    <h1 className='fashionscape-home'>Fashionscape</h1>
                </Link>
                <div className='input-searchbar'>
                    <SearchOutlinedIcon className='search-icon'/>
                    <input type='text' id='searchbar' name='searchbar' placeholder='Search'className='input-searchbar'/>
                    <div className='menu-icons'>
                        <Link to="/create">
                            <AddCircleIcon className='add-icon'/>
                        </Link>
                        <Link to="/chat">
                            <ChatBubbleIcon className='chat-icon'/>
                        </Link>
                        <Link to="/likes">
                            <FavoriteIcon className='like-icon'/>
                        </Link>
                        <Link to="/profile">
                            <PersonIcon className='profile-icon'/>          
                        </Link>
                        <button className='signout-button'>Log In</button>
                    </div>
                </div>
            </div>

            <div className='masonry'>
                <Masonry images={likedImages} columnCount='6' gap="5"></Masonry>
            </div>
        </div>
    );
};


export default Likes;