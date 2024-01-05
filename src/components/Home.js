import React, {useEffect, useState} from 'react';
import '../styles/Home.css';

// import io from 'socket.io-client';
// import Masonry from 'masonry-layout';
// import imagesLoaded from 'imagesloaded';
import Masonry from './Masonry.js';
import Navbar from './Navbar.js';

const Home = ({images}) => {
  // const socket = io.connect('http://localhost:3001');

  const [refreshedImages, setRefreshedImages] = useState([]);
  
  useEffect(() => {
    setRefreshedImages(images);
  }, [images]);

  // useEffect(() => {
  //   socket.on('newImage', (newImage) => {
  //     setImages((prevImages) => [newImage, ...prevImages]);
  //   });

  //   return () => {
  //     socket.off('newImage');
  //   };
  // }, []);

  return (
    <div id='home'>
      <Navbar/>
      <div className='masonry'>
        <Masonry images={refreshedImages} columnCount='6' gap="5"></Masonry>
      </div>
    </div>
  );
};

export default Home;
