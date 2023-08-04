import React, { useState } from 'react';
import UserDetailsPopup from './UserDetailsPopup';

const UserList = ({ users, handleUserClick, username }) => {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleViewProfile = (user) => {
    setSelectedUser(user);
  };

  const handleClosePopup = () => {
    setSelectedUser(null);
  };

  return (
    <div className='user-list'>
      <h1>Users List</h1>
      <ul>
        {users.map((user) => {
          if (user.username === username) {
            return null;
          }

          return (
            <div className='user-card' key={user.id}>
              <div className='fullname'>
                {user.first_name} {user.last_name}
              </div>

              <div className='buttons-container'>
                <button type='button' onClick={() => handleViewProfile(user)}>
                  View Profile
                </button>
                <button type='button' onClick={() => handleUserClick(user)}>
                  Chat
                </button>
              </div>
            </div>
          );
        })}
      </ul>

      {selectedUser && (
        <UserDetailsPopup
          user={selectedUser}
          isOpen={!!selectedUser}
          onRequestClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default UserList;
