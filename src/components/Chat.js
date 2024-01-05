import React, {useEffect, useRef} from 'react';
import '../styles/Home.css';
import '../styles/Chat.css';
import { useChat } from 'ai/react'; // Import useCompletion and useChat from ai/react
import Navbar from './Navbar';

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
            <Navbar/>
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
                    <form className="chat-form" onSubmit={handleSubmit}>
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
