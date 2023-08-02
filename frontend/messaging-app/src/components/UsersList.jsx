import React from 'react';

const UserList = ({ users , handleUserClick}) => {
  return (
    <div className='user-list'>
      <h1>Users List</h1>
      <ul>
        {users.map((user) => (
            <div key={user.id} onClick={() => handleUserClick(user)}>
            <p>{user.first_name} {user.last_name} - {user.username}</p>
            </div>
        ))}
      </ul>
    </div>
  );
};

export default UserList;