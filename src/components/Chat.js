import React, {useEffect, useRef} from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import '../styles/Chat.css';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useChat } from 'ai/react'; // Import useCompletion and useChat from ai/react

const Chat = () => {
    const { messages, input, handleInputChange, handleSubmit } = useChat({
        api: 'http://localhost:3001/chat-stream', // Replace with your actual server endpoint
    });

    const chatWindowRef = useRef(null);

    useEffect(() => {
        // Scroll chat window to bottom on new message
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div id='home'>
            <div className='nav-bar'>
                <Link to="/home" className='home-link'>
                    <h1 className='fashionscape-home'>Fashionscape</h1>
                </Link>
                <div className='input-searchbar'>
                    <SearchOutlinedIcon className='search-icon'/>
                    <input type='text' id='searchbar' name='searchbar' placeholder='Search'className='input-searchbar'/>
                    <div className='menu-icons'>
                        <Link to="/create">
                            <AddCircleIcon className='add-icon'/>
                        </Link>
                        <Link to="/chat">
                            <ChatBubbleIcon className='chat-icon'/>
                        </Link>
                        <Link to="/likes">
                            <FavoriteIcon className='like-icon'/>
                        </Link>
                        <Link to="/profile">
                            <PersonIcon className='profile-icon'/>          
                        </Link>
                        <button className='signout-button'>Log In</button>
                    </div>
                </div>
            </div>
            <div className='centered-chat-container'>
                <div className="chat-window" ref={chatWindowRef}>
                    {/* Display chat messages */}
                    {messages.map((message, index) => (
                        <div key={index}>
                            {message.role === 'user' ? <strong>You:</strong> : <strong>Style Bot:</strong>}
                            <div style={{ whiteSpace: 'pre-line' }}>{message.content}</div>
                        </div>
                    ))}
                </div>
                {/* Input field to send messages */}
                <div className="input-area">
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Type a fashion-related question..."
                        />
                        <button type="submit" className="chat-button">Send</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Chat;
