import React, { useState, useEffect} from 'react';
import '../styles/Home.css';
import Masonry from './Masonry';
import axios from 'axios';
import { useUser } from './UserContext';
import Navbar from './Navbar';

const Likes = () => {

    const { user } = useUser();
    const [likedImages, setLikedImages] = useState([]);

    useEffect(() => {
        async function fetchLikedImages() {
            if (user && user.username) {
                try {
                    const response = await axios.get(`https://fashionscape-backend.onrender.com/likedimages/${user.username}`);
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
            <Navbar/>
            <div className='masonry'>
                <Masonry images={likedImages} gap="5"></Masonry>
            </div>
        </div>
    );
};


export default Likes;