import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import '../styles/Create.css';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import AddCircleIcon from '@mui/icons-material/AddCircle';


const Create = () => {
    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [previewImage, setPreviewImage] = useState(null);
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false); // Add state to track if an image is uploaded

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);

        const reader = new FileReader();
        reader.onload = () => {
            setPreviewImage(reader.result);
            setIsUploaded(true);
        };
        reader.readAsDataURL(selectedFile);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (!file || !title || !description) {
            console.log('File:', file);
            console.log('Title:', title);
            console.log('Description:', description);
    
            alert('Please make sure all fields are filled.');
            return;
        }
    
        try {
            const formData = new FormData();
            formData.append('file', file);
    
            // Upload the file to AWS S3
            const uploadResponse = await fetch('http://localhost:3001/uploadToS3', {
                method: 'POST',
                body: formData
            });
    
            if (!uploadResponse.ok) {
                throw new Error('Error uploading file to S3');
            }
    
            const uploadData = await uploadResponse.json();
            const { url } = uploadData;
    
            // Store post information along with the obtained imageURL
            const postResponse = await fetch('http://localhost:3001/storePosts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ imageURL: url, title, description })
            });
    
            if (!postResponse.ok) {
                throw new Error('Error storing post information');
            }
    
            // If both upload and post requests are successful, reset the form fields
            setFile(null);
            setTitle('');
            setDescription('');
            alert('Image successfully uploaded!');
            navigate('/home');
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDraggingOver(true);
    };

    const handleDragEnter = (event) => {
        event.preventDefault();
        setIsDraggingOver(true);
    };

    const handleDragLeave = () => {
        setIsDraggingOver(false);
    };

    const handleDragDrop = (event) => {
        event.preventDefault();
        setIsDraggingOver(false);

        const droppedFile = event.dataTransfer.files[0];
        setFile(droppedFile);

        // Generate preview for dropped image
        const reader = new FileReader();
        reader.onload = () => {
            setPreviewImage(reader.result);
            setIsUploaded(true);
        };
        reader.readAsDataURL(droppedFile);
    };
    

    return (
        <div id='home'>
            <div className='nav-bar'>
            <Link to="/home" className='home-link'>
                <h1 className='fashionscape-home'>Fashionscape</h1>
            </Link>
            <div className='input-searchbar'>
                <SearchOutlinedIcon className='search-icon'/>
                <input type='text' id='searchbar' name='searchbar' placeholder='Search'className='input-searchbar'/>
                <Link to="/create">
                        <AddCircleIcon className='add-icon'/>
                    </Link>
                <Link to="/Chat">
                    <ChatBubbleIcon className='chat-icon'/>
                </Link>
                <Link to="/Likes">
                    <FavoriteIcon className='like-icon'/>
                </Link>
                <Link to="/Profile">
                    <PersonIcon className='profile-icon'/>          
                </Link>
            </div>
            </div>
            <div id='create'>
                <div className='create-post-form'>
                    <form onSubmit={handleSubmit} className='file-upload-form'>
                        <label 
                            htmlFor='file' 
                            className={`file-upload-label ${isDraggingOver ? 'dragging-over' : ''} ${isUploaded ? 'uploaded' : ''}`}
                            onDragOver={handleDragOver}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDragDrop}
                        >
                            {previewImage && (
                                <img src={previewImage} alt='Preview'/>
                            )} 
                            {!previewImage && (
                                <div className="file-upload-design">
                                    <svg viewBox="0 0 640 512" height="1em">
                                        <path
                                        d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"
                                        ></path>
                                    </svg>
                                    <p>Drag and Drop</p>
                                    <p>or</p>
                                    <span className="browse-button">Browse file</span>
                                </div>
                            )}
                            <input id='file' type='file' accept="image/bmp,image/jpeg,image/png,image/tiff,image/webp,video/mp4,video/x-m4v,video/quicktime" 
                            onChange={handleFileChange}/>
                        </label>
                        <div className='create-form-details'>
                            <h3>Create Post</h3>
                            <div className="input-group">
                                <label htmlFor="title">Title:</label>
                                <input
                                    type='text'
                                    id='title'
                                    placeholder='Title'
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="description">Description:</label>
                                <textarea
                                    id='description'
                                    placeholder='Description---include any hashtags'
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                ></textarea>
                            </div>
                            <button type='submit' className='post-button'>Post</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    );
};


export default Create;