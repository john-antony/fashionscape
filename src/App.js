// Import necessary modules and components
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Enter from './components/Enter';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Profile from './components/Profile';
import Likes from './components/Likes';
import Chat from './components/Chat';
import Image from './components/Image';
import './App.css';

function App() {
  const images = [
    {
      url: 'archivepillar.jpg',
      alt: 'archive pillar',
      title: 'Title of Image 1',
      description: 'Description of Image 1',
    },
    {
      url: 'Bottega Veneta Fall 2023 Milan - Fashionably Male.jpg',
      alt: 'Bottega',
      title: 'Title of Image 2',
      description: 'Description of Image 2',
    },
    {
      url: 'Junya Watanabe Fall 2006 Ready-to-Wear Fashion Show.jpg',
      alt: 'Junya',
      title: 'Title of Image 2',
      description: 'Description of Image 2',
    },
    {
      url: 'PAF.jpg',
      alt: 'PAF',
      title: 'Title of Image 2',
      description: 'Description of Image 2',
    },
    {
      url: 'CDG.jpg',
      alt: 'CDG',
      title: 'Title of Image 2',
      description: 'Description of Image 2',
    },
    {
      url: 'Rick Owens Spring 2011 Menswear Fashion Show.jpg',
      alt: 'Rick Owens',
      title: 'Title of Image 2',
      description: 'Description of Image 2',
    },
    {
      url: 'Yohji Yamamoto _ Menswear - Autumn 2020 _ Look 12.jpg',
      alt: 'Yohji Yamamoto',
      title: 'Title of Image 2',
      description: 'Description of Image 2',
    },]

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Enter />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/home" element={<Home images={images}/>} />
        <Route exact path="/image/:imageId" element={<Image images={images}/>} />
        <Route exact path="/profile" element={<Profile />} />
        <Route exact path="/likes" element={<Likes />} />
        <Route exact path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

// // PrivateRoute component to handle redirection for authenticated users
// const PrivateRoute = ({ component: Component, ...rest }) => {
//   // const isLoggedIn = /* Check if the user is authenticated */;

//   return (
//     <Route
//       {...rest}
//       render={(props) =>
//         isLoggedIn ? (
//           <Component {...props} />
//         ) : (
//           <Redirect to="/login" />
//         )
//       }
//     />
//   );
// };

export default App;
