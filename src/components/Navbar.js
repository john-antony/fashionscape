import React, {useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { useUser } from './UserContext.js'
import {auth} from '../firebase.js';
import '../styles/Navbar.css'
import axios from 'axios';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track user login status
    const navigate = useNavigate();
    const { logoutUser, user } = useUser();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState({ users: [], posts: [] });

    const handleSearch = async (searchQuery) => {
        try {
            // Make API call to fetch users based on search term
            const usersResponse = await axios.get(`https://fashionscape-backend.onrender.com/userSearch?search=${searchQuery}`);
            const userData = await usersResponse.data;

            // Make API call to fetch posts based on search term
            const postsResponse = await axios.get(`https://fashionscape-backend.onrender.com/postSearch?search=${searchQuery}`);
            const postData = await postsResponse.data;

            setSearchResults({ users: userData, posts: postData });
        } catch (error) {
            console.error('Search failed:', error);
        }
    };

    const handleInputChange = (event) => {
        const { value } = event.target;
        setSearchTerm(value);
        handleSearch(value);
    };

    const clearSearch = () => {
        setSearchTerm('');
        setSearchResults({ users: [], posts: [] });
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setIsLoggedIn(true); // If user is logged in, set isLoggedIn to true
            } else {
                setIsLoggedIn(false); // If user is not logged in, set isLoggedIn to false
            }
        });

        return () => unsubscribe(); // Cleanup function to unsubscribe from auth state changes
    }, []);

    const handleLogout = async () => {
        try {
            await auth.signOut(); // Sign out the user using Firebase auth
            logoutUser();
            setIsLoggedIn(false);
            alert('User successfully signed out.') // Update isLoggedIn state
            navigate('/'); // Redirect to the '/' page after logout
        } catch (error) {
            console.error('Logout Failed:', error);
        }
    };

    return (
        <div className='nav-bar'>
            <Link to="/home" className='home-link'>
                <h1 className='fashionscape-home'>Fashionscape</h1>
            </Link>
            <div className='searchbar-container'>
                <SearchOutlinedIcon className='search-icon'/>
                {searchTerm && (
                    <CancelOutlinedIcon
                        className='clear-button'
                        onClick={clearSearch}
                    />
                )}
                <input 
                    type='text' 
                    id='searchbar' 
                    name='searchbar' 
                    placeholder='Search'
                    className='input-searchbar'
                    value={searchTerm}
                    onChange={handleInputChange}
                />
                {searchTerm && (
                <div className='search-results'>
                    <div className='user-results'>
                        <h3 className='search-result-header'>Users:</h3>
                        <ul>
                            {searchResults.users.map((user) => (
                                <Link className='search-result-link' to={`/profile/${user.username}`}>
                                    <li key={user.id}>
                                        <span className='search-result-bubble'>{user.username}</span>
                                    </li>
                                </Link>
                            ))}
                        </ul>
                    </div>
                    <div className='post-results'>
                        <h3 className='search-result-header'>Posts:</h3>
                        <ul>
                            {searchResults.posts.map((post) => (
                                <Link className='search-result-link' to={`/image/${post._id}`}>
                                    <li key={post.id}>
                                        <span className='search-result-bubble'>{post.title}</span>
                                    </li>
                                </Link>
                            ))}
                        </ul>
                    </div>
                </div>
                )}
            </div>
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
                <Link to={user && user.username ? `/profile/${user.username}` : '/profile/Guest'}>
                    <PersonIcon className='profile-icon'/>          
                </Link>
                {isLoggedIn ? (
                        // If user is logged in, display Sign Out button
                <button className='signout-button' onClick={handleLogout}>Log Out</button>
                ) : (
                    // If user is not logged in, display Log In button
                    <Link to="/login">
                        <button className='signout-button'>Log In</button>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;
