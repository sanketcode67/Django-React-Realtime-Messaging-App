import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserList from './UsersList';
import Chat from './Chat';
import { useLocation } from 'react-router-dom';


const Dashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const location = useLocation();
  const username = location.state?.username || null;

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
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Handle error if needed
    }
  };
  useEffect(() => {
    // fetch users data when the component loads
    fetchUsersData();
  }, []);


  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8000/auth/logout/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
  
      if (response.status === 200) {
        localStorage.clear();
        navigate('/login');
      } else {
        console.error('Logout failed:', response.data);
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="dashboard">
    <h2>Welcome, {username}!</h2>
    <button type='submit' onClick={handleLogout}>Logout</button>
    <div className='card'>
      <div className='left'>
        <UserList users={users} username={username} handleUserClick={handleUserClick} />
      </div>
      <div className='right'>
        <Chat selectedUser={selectedUser}></Chat>
      </div>
    </div>
  </div>
  );
};

export default Dashboard;
