import React, {useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useUser } from './UserContext.js'
import {auth} from '../firebase.js';
import '../styles/Navbar.css'

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track user login status
    const navigate = useNavigate();
    const { logoutUser, user } = useUser();

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
            <div className='input-searchbar'>
                <SearchOutlinedIcon className='search-icon'/>
                <input type='text' id='searchbar' name='searchbar' placeholder='Search'className='input-searchbar'/>
                <div className='menu-icons'>
                    {isLoggedIn ? (
                            // If user is logged in, display Sign Out button
                    <button className='signout-button' onClick={handleLogout}>Log Out</button>
                    ) : (
                        // If user is not logged in, display Log In button
                        <Link to="/login">
                            <button className='signout-button'>Log In</button>
                        </Link>
                    )}
                    <Link to="/create">
                        <AddCircleIcon className='add-icon'/>
                    </Link>
                    <Link to="/chat">
                        <ChatBubbleIcon className='chat-icon'/>
                    </Link>
                    <Link to="/likes">
                        <FavoriteIcon className='like-icon'/>
                    </Link>
                    <Link to={user && user.username ? `/profile/${user.username}` : '/profile'}>
                        <PersonIcon className='profile-icon'/>          
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
