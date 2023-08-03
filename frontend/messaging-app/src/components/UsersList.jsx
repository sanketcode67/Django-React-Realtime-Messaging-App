import React , { useContext }from 'react';
import { UserContext } from './UserContext';


const UserList = ({ users , handleUserClick}) => {
    const { username } = useContext(UserContext);
  

    return (
        <div className='user-list'>
          <h1>Users List</h1>
          <ul>
            {users.map((user) => {


              if (user.username === username) {
                return null;
              }
    
              return (
                <div key={user.id} onClick={() => handleUserClick(user)}>
                  <p>
                    {user.first_name} {user.last_name} - {user.username}
                  </p>
                </div>
              );
            })}
          </ul>
        </div>
      );
    };
    
    
    
    

export default UserList;