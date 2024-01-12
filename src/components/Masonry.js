import React, { useState, useEffect} from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from './UserContext';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Masonry(props) {
  const navigate = useNavigate();
  const { user } = useUser();
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [likedImages, setLikedImages] = useState([]);
  const [createdPosts, setCreatedPosts] = useState([]);
  const [deleteHoverIndex, setDeleteHoverIndex] = useState(null);

  const [columnCount, setColumnCount] = useState(6);

  useEffect(() => {
    // Function to update columnCount based on screen width
    const updateColumnCount = () => {
      if (window.innerWidth >= 1600) {
        setColumnCount(7);
      } else if (window.innerWidth >= 1300) {
        setColumnCount(6);
      } else if (window.innerWidth >= 1100) {
        setColumnCount(5);
      } else if (window.innerWidth >= 992) {
        setColumnCount(4);
      } else if (window.innerWidth >= 768) {
        setColumnCount(3);
      } else if (window.innerWidth >= 576) {
        setColumnCount(2);
      } else {
        setColumnCount(1);
      }
    };

    // Update columnCount initially and add a listener for window resize
    updateColumnCount();
    window.addEventListener('resize', updateColumnCount);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', updateColumnCount);
    };
  }, []);

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

  useEffect(() => {
    async function fetchCreatedImages() {
      if (user && user.username) {
        try {
          const response = await axios.get(`http://localhost:3001/createdposts/${user.username}`);
          if (response.status === 200) {
            // Extract created image URLs from the response and update likedImages state
            const {createdPosts} = response.data;
            const reformattedCreatedPosts = createdPosts.map(imageURL => {
              const startIndex = imageURL.indexOf('uploads/') + 'uploads/'.length;
              return imageURL.substring(startIndex, startIndex + 36);
            });
            setCreatedPosts(reformattedCreatedPosts);
          }
        } catch (error) {
          console.error('Error fetching liked images:', error);
        }
      }
    }

    fetchCreatedImages();
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

  const handleDeleteClick = async (index, imageURL) => {
    const confirmation = window.confirm('Are you sure you want to delete this post?');
    if (confirmation) {
      try {
        const postResponse = await axios.get(`http://localhost:3001/posts/search?imageURL=${imageURL}`);
        if (postResponse.status === 200) {
          const { post } = postResponse.data;

          const deletePostResponse = await axios.delete(`http://localhost:3001/deletePost/${post._id}`);

          if (deletePostResponse.status === 200) {
            // remove imageurl from users createdposturls
            const deleteCreatedUrlsResponse = await axios.patch(`http://localhost:3001/deleteCreatedUrl/${user.username}`, { imageURL });

            if (deleteCreatedUrlsResponse.status === 200) {
              // Remove the post from all users' likedImageUrls array
              const usersUrlArrayResponse = await axios.patch('http://localhost:3001/posts/removelike', {imageURL});

              if (usersUrlArrayResponse.status === 200) {
                console.log('imageURL:', imageURL);

                const s3DeleteResponse = await axios.delete('http://localhost:3001/deleteS3Object', {data: {imageURL}});

                if (s3DeleteResponse.status === 200) {
                  alert('Post succesfully deleted from system. :)');
                }
                else {
                  console.error('Error removing object from S3:', s3DeleteResponse.data.message)
                }
              }
              else {
                console.error('Error removing post from users likedimageUrls', usersUrlArrayResponse.data.message);
              }

            // Delete the object from S3 bucket using appropriate SDK
            // Example: AWS SDK or any other library you're using for S3 operations
            } else {
              console.error('Error removing post from user createdPostUrls:', deleteCreatedUrlsResponse.data.message);
            }
          } else {
            console.error('Error deleting post:', deletePostResponse.data.message);
          }
        } else {
          console.error('Error fetching post information:', postResponse.data.message);
        }
      } catch (error) {
        console.error('Error deleting post:', error);
      }
      setSelectedImageIndex(index); 
    }
  };

  return (
    <div style={{ columns: columnCount, gutter: 0 }}>
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
          {createdPosts.includes(img.imageURL.substring(img.imageURL.indexOf('uploads/') + 'uploads/'.length, img.imageURL.indexOf('uploads/') + 'uploads/'.length + 36)) ? (
              deleteHoverIndex === i ? (
                <DeleteIcon
                  className="delete-icon"
                  fontSize='large'
                  onClick={() => handleDeleteClick(i, img.imageURL)}
                  onMouseEnter={() => setDeleteHoverIndex(i)}
                  onMouseLeave={() => setDeleteHoverIndex(null)}
                />
              ) : (
                <DeleteOutlineIcon
                  className="outlined-delete-icon"
                  fontSize='large'
                  onClick={() => handleDeleteClick(i, img.imageURL)}
                  onMouseEnter={() => setDeleteHoverIndex(i)}
                  onMouseLeave={() => setDeleteHoverIndex(null)}
                />
              )
          ) : null}
        </div>
      ))}
    </div>
  );
}
