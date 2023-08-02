import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserList from './UsersList';
import Chat from './Chat';


const Dashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // function to handle selected user
  const handleUserClick = (user) => {
    setSelectedUser(user);
  };


  //function for fetching users
  const fetchUsersData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8000/auth/user/all', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setUsers(response.data.friends);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Handle error if needed
    }
  };
  useEffect(() => {
    // fetch users data when the component loads
    fetchUsersData();
  }, []);

  // extact the username from local storage
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    // Clear the local storage
    localStorage.clear();
    // Redirect to the login page
    navigate('/login');
  };

  return (
    <div className="dashboard">
    <h2>Welcome, {username}!</h2>
    <button type='submit' onClick={handleLogout}>Logout</button>
    <div className='card'>
      <div className='left'>
        <UserList users={users} handleUserClick={handleUserClick} />
      </div>
      <div className='right'>
        <Chat selectedUser={selectedUser}></Chat>
      </div>
    </div>
  </div>
  );
};

export default Dashboard;
