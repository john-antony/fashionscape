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

    // const imageForm = document.querySelector("#imageForm");
    // const imageInput = document.querySelector("#imageInput");

    // imageForm.addEventListener("submit", async event => {
    //     event.preventDefault();
    //     const file = imageInput.files[0];

    //     const {url} = await fetch("/s3Url").then(res => res.json());
    //     console.log(url);

    //     await fetch(url, {
    //         method: "PUT",
    //         headers: {
    //             "Content-Type": "multipart/form-data"
    //         },
    //         body: file
    //     })
    //     const imageUrl = url.split('?')[0]
    //     console.log(imageUrl);

    //     const img = document.createElement("img");
    //     img.src = imageUrl;
    //     document.body.appendChild(img);
    // })

    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     const file = e.target.querySelector('input[type="file"]').files[0];
    //     const title = e.target.querySelector('input[type="text"]').value;
    //     const description = e.target.querySelector('textarea').value;

    //     const {url} = await fetch(`http://localhost:3001/s3Url?title=${title}&description=${description}`).then((res) => res.json());
    //     console.log(url);

    //     const formData = new FormData();
    //     formData.append("file", file);

    //     await fetch(url, {
    //         method: "PUT",
    //         body: formData,
    //     });

    //     const imageUrl = url.split('?')[0]
    //     console.log(imageUrl);
    // }
    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
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
                    <form onSubmit={handleSubmit}>
                        <input type='file' accept="image/bmp,image/jpeg,image/png,image/tiff,image/webp,video/mp4,video/x-m4v,video/quicktime" 
                        onChange={handleFileChange}/>
                        <input type='text' placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)}/>
                        <textarea type='text' placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                        <button type='submit' className='post-button'>Post</button>
                    </form>
                </div>
            </div>
        </div>

    );
};


export default Create;