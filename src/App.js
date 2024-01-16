// Import necessary modules and components
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Enter from './components/Enter';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Profile from './components/Profile';
import Likes from './components/Likes';
import Chat from './components/Chat';
import Image from './components/Image';
import Create from './components/Create';
import { UserProvider } from './components/UserContext';
import { ChatProvider } from './components/ChatContext';
import './App.css';
import axios from 'axios';

function App() {

  return (
    <UserProvider>
      <ChatProvider>
        <Router>
          <Routes>
            <Route exact path="/" element={<Enter />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/home" element={<Home />} />
            <Route exact path="/image/:postId" element={<Image />} />
            <Route exact path="/create" element={<Create />} />
            <Route exact path="/profile/:username" element={<Profile />} />
            <Route exact path="/likes" element={<Likes />} />
            <Route exact path="/chat" element={<Chat />} />
          </Routes>
        </Router>
      </ChatProvider>
    </UserProvider>
  );
}

export default App;
