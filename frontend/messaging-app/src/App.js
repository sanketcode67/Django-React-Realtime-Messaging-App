
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import HomeNavbar from './components/HomeNavbar';
import Registration from './components/Registration';
import './css/HomeNavbar.css';
import './css/Login.css';
import './css/Registration.css';
import './css/Dashboard.css';




const App = () => {


  //check to see if the user is authenticated
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <HomeNavbar></HomeNavbar>
      <Routes>
        {/* Route for the login page */}
        <Route path="/login" element={<Login />} />

        {/* Route for the registration page */}
        <Route path="/registration" element={<Registration />} />

        {/* Protected route for the welcome page */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />

        {/* Default route - Redirects to login
        <Route path="/" element={<Navigate to="/login" />} /> */}
      </Routes>
    </Router>
  );
};

export default App;