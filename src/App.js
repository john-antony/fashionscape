// Import necessary modules and components
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Enter from './components/Enter';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Enter />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/home" element={<Home />} />
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
