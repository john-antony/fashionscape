import React, { useState, useEffect} from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from './UserContext';

export default function Masonry(props) {
  const navigate = useNavigate();
  const { user } = useUser();
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [likedImages, setLikedImages] = useState([]);

  useEffect(() => {
    async function fetchLikedImages() {
      if (user && user.username) {
        try {
          const response = await axios.get(`http://localhost:3001/likedimages/${user.username}`);
          if (response.status === 200) {
            // Extract liked image URLs from the response and update likedImages state
            const {likedImages} = response.data;
            const reformattedLikedImages = likedImages.map(imageURL => {
              const startIndex = imageURL.indexOf('uploads/') + 'uploads/'.length;
              return imageURL.substring(startIndex, startIndex + 36);
            });
            setLikedImages(reformattedLikedImages);
          }
        } catch (error) {
          console.error('Error fetching liked images:', error);
        }
      }
    }

    fetchLikedImages();
  }, [user]);

  function normalizeURL(url) {
    const urlParts = url.split('/');
    const normalizedURL = urlParts
      .filter(part => !part.includes('.amazonaws.com'))
      .join('/');
    return normalizedURL;
  }

  const handleImageClick = async (imageURL) => {
    try {
      const normalizedURL = normalizeURL(imageURL);
      console.log(normalizedURL);
      const response = await axios.get(`http://localhost:3001/posts/search?imageURL=${normalizedURL}`);
      if (response.status === 200) {
        const {post} = response.data;

        console.log('Post Information:', post);

        navigate(`/image/${post._id}`);
      }
    }
    catch (error) {
      console.error('Error fetching post information', error);
    }
    
  }

  const handleLikeClick = async (index, imageURL) => {
    if (user && user.username){
      try {
      
        const postResponse = await axios.get(`http://localhost:3001/posts/search?imageURL=${imageURL}`);
        if (postResponse.status === 200) {
          const {post} = postResponse.data;

          const formattedURL = post.imageURL.replace(/s3\..+?\.amazonaws\.com/, 's3.amazonaws.com');

          const response = await axios.post('http://localhost:3001/addlike', {
            username: user.username,
            imageURL: formattedURL,
          });

          console.log(response);
    
          if (response.status === 200){
            const {isLiked} = response.data;
            setSelectedImageIndex(index);
    
            if (isLiked) {
              setLikedImages([...likedImages, imageURL.substring(imageURL.indexOf('uploads/') + 'uploads/'.length, imageURL.indexOf('uploads/') + 'uploads/'.length + 36)]);
            } else {
              setLikedImages(likedImages.filter(likedImage => likedImage !== imageURL.substring(imageURL.indexOf('uploads/') + 'uploads/'.length, imageURL.indexOf('uploads/') + 'uploads/'.length + 36)));
            }
          }
          else {
            console.error('Error updating Like:', response.data.message);
          }
        }
        else {
          console.error('Error getting post info:', postResponse.data.message);
        }
      

      }
      catch (error) {
        console.error('Error updating like:', error);
      }
    }
    else {
      navigate('/login');
    }

    setSelectedImageIndex(index); 
  };

  return (
    <div style={{ columns: props.columnCount, gutter: 0 }}>
      {props.images.map((img, i) => (
        <div
          key={i}
          className="image-container"
          onMouseEnter={() => setSelectedImageIndex(i)}
          onMouseLeave={() => setSelectedImageIndex(null)}
          style={{ padding: props.gap / 2 }}
        >
          <img
            src={img.imageURL}
            alt=""
            className="image"
            onClick={() => handleImageClick(img.imageURL)}
          />
          {likedImages.includes(img.imageURL.substring(img.imageURL.indexOf('uploads/') + 'uploads/'.length, img.imageURL.indexOf('uploads/') + 'uploads/'.length + 36)) ? (
            <FavoriteIcon
              className="favorite-icon"
              fontSize='large'
              onClick={() => handleLikeClick(i, img.imageURL)}
            />
          ) : (
          <FavoriteBorderOutlinedIcon 
            className="outlined-favorite-icon" 
            fontSize='large' 
            onClick={() => handleLikeClick(i, img.imageURL)}
          />)}
        </div>
      ))}
    </div>
  );
}
