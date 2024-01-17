import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../styles/Home.css';
import '../styles/Image.css';
import axios from 'axios';
import Navbar from './Navbar';

const Image = () => {

    const {postId} = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        async function fetchPost() {
            try {
                const response = await axios.get(`https://fashionscape-backend.onrender.com/posts/${postId}`);
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
            <Navbar/>
            <div className='centered-image'>
                <div className='image-details-container'>
                    <div className='image-view-container'>
                        <img src={post.imageURL} alt="" className='image-proportions' />
                    </div>
                    <div className='details-container'>
                        <h2 className='post-title'>{post.title}</h2>
                        <p className='post-description'>{post.description}</p>
                        <Link to={`/profile/${post.username}`} className='username-link'>
                            <h3 className='image-username'>{`@${post.username}`}</h3>
                        </Link>
                        
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Image;