
import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import HomeNavbar from './components/HomeNavbar';
import Registration from './components/Registration';
import './css/HomeNavbar.css';
import './css/Login.css';
import './css/Registration.css';
import './css/Dashboard.css';
import './css/UserList.css';
import './css/Chat.css';
import Modal from 'react-modal';
Modal.setAppElement('#root');





const App = () => {
  const [authenticated, setAuthenticated] = useState("")
  const isAuthenticated = !!localStorage.getItem('token');


  useEffect(() => {
   
    setAuthenticated(isAuthenticated);
  }, [isAuthenticated]);

  return (
    <Router>
      <HomeNavbar authenticated={authenticated}></HomeNavbar>
      <Routes>
        {/* Route for the login page */}
        <Route path="/login" element={<Login setAuthenticated={setAuthenticated}/>} />

        {/* Route for the registration page */}
        <Route path="/registration" element={<Registration />} />

        {/* Protected route for the welcome page */}
        <Route
          path="/dashboard"
          element={authenticated || isAuthenticated? <Dashboard setAuthenticated={setAuthenticated}/> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
};

export default App;