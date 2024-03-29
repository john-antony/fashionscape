import React, { useState, useEffect } from 'react';
import '../styles/Home.css';
import Navbar from './Navbar';
import '../styles/Profile.css';
import Masonry from './Masonry.js';
import axios from 'axios';
import { useParams } from 'react-router-dom';


const Profile = () => {
    const {username} = useParams();
    const [createdPosts, setCreatedPosts] = useState([]);

    useEffect(() => {
        async function fetchCreatedPosts() {
            
            try {
                const response = await axios.get(`https://fashionscape-backend.onrender.com/createdposts/${username}`);
                if (response.status === 200) {
                    const { createdPosts } = response.data;
                    // Transform the likedImages array into objects with imageURL property
                    const formattedCreatedPosts = createdPosts.map(imageURL => {
                    // Replace the domain in imageURL using a regular expression
                    const formattedURL = imageURL.replace(/s3\..+?\.amazonaws\.com/, 's3.amazonaws.com');
                    return { imageURL: formattedURL };
                });

                setCreatedPosts(formattedCreatedPosts);
                }
            } 
            catch (error) {
                console.error('Error fetching created images:', error);
            }
            
        }
    
        fetchCreatedPosts();
    },);

    return (
        <div id='home'>
            <Navbar/>
            <div className='profile-page-container'>
                <div className='username-title-container'>
                    <h1 className='username-title'>{username}</h1>
                </div>
                <div className='profile-masonry'>
                    <Masonry images={createdPosts} gap="5"></Masonry>
                </div>
            </div>
        </div>
    );
};

export default Profile;