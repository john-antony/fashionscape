import React, {useEffect, useState} from 'react';
import '../styles/Home.css';

import io from 'socket.io-client';
// import Masonry from 'masonry-layout';
// import imagesLoaded from 'imagesloaded';
import Masonry from './Masonry.js';
import Navbar from './Navbar.js';

const socket = io.connect('https://fashionscape-backend.onrender.com');

const Home = () => {

  const [images, setImages] = useState([]);

  useEffect(() => {
    // Fetch initial images from server
    fetchImages();

    // Listen for socket updates
    socket.on('imagesUpdated', (updatedImages) => {
      setImages(updatedImages);
    });

    return () => {
      // Clean up event listener on unmounting component
      socket.off('imagesUpdated');
    };
  }, []);

  const fetchImages = () => {
    // Fetch images from the server
    fetch('https://fashionscape-backend.onrender.com/images')
      .then((response) => response.json())
      .then((data) => {
        setImages(data);
      })
      .catch((error) => {
        console.error('Error fetching images:', error);
      });
  };

  return (
    <div id='home'>
      <Navbar/>
      <div className='masonry'>
        <Masonry images={images} gap="5"></Masonry>
      </div>
    </div>
  );
};

export default Home;
