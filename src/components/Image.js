import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../styles/Home.css';
import '../styles/Image.css';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import axios from 'axios';

const Image = () => {

    const {postId} = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        async function fetchPost() {
            try {
                const response = await axios.get(`http://localhost:3001/posts/${postId}`);
                if (response.status === 200) {
                    setPost(response.data);
                }
            }
            catch (error) {
                console.error('Error fetching Post:', error);
            }
        }

        fetchPost();
    }, [postId]);

    if (!post) {
        return (
            <div>
                <p>Loading...</p>
            </div>
        );
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
            <div className='centered-image'>
                <div className='image-details-container'>
                    <div className='image-container'>
                        <img src={post.imageURL} alt="" className='image-proportions' />
                    </div>
                    <div className='details-container'>
                        <h2 className='post-title'>{post.title}</h2>
                        <p className='post-description'>{post.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Image;