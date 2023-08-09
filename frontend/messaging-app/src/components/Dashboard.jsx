import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserList from './UsersList';
import Chat from './Chat';
import { useLocation } from 'react-router-dom';



const Dashboard = ({setAuthenticated}) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);


  const location = useLocation();
  const username = location.state?.user;
  const userId = location.state?.userId;



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
      setFilteredUsers(response.data.users);
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
        setAuthenticated(false)
        navigate('/login');
      } else {
        console.error('Logout failed:', response.data);
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  const handleSearchUser = (event) => {
      const inputData = event.target.value
      if(inputData === '')
      { 
        setFilteredUsers(users);
      }
      else
      {
        const filteredData = users.filter((user) =>
          user.first_name.toLowerCase().includes(inputData.toLowerCase())
        );
        setFilteredUsers(filteredData);
      }
      

  }

  return (
    <div className="dashboard">
    <h2>Welcome, {username} {userId}!</h2>
    <button type='submit' onClick={handleLogout}>Logout</button>
    <button type='submit'>Change Password</button>

    <div className='card'>
      <div className='left'>
        <input type='text' placeholder='Search User...' onChange={handleSearchUser}></input>
        <h3>Users List</h3>
        <UserList users={filteredUsers} username={username} handleUserClick={handleUserClick} />
      </div>
      <div className='right'>
      {selectedUser && <Chat selectedUser={selectedUser} username={username} userId = {userId}/>}
      </div>
    </div>
  </div>
  );
};

export default Dashboard;
