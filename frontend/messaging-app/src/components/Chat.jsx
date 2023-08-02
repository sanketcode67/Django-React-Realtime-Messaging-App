import React, { useState, useEffect} from 'react';



const Chat = ({ selectedUser }) => {
    const [messages, setMessages] = useState(null);

    const fetchMessages = (userid) => {
        const message = `Fetched messages for userid: ${userid}`
        setMessages(message);
    }
    useEffect(() => {
        if (selectedUser) {
          fetchMessages(selectedUser.id);
        }
      }, [selectedUser]);
  return (
    <div>
      {selectedUser && (
        <div>
          <p>Selected User:</p>
          <p>User id: {selectedUser.id}</p>
          <p>First Name: {selectedUser.first_name}</p>
          <p>Last Name: {selectedUser.last_name}</p>
          <p>Username: {selectedUser.username}</p>
        </div>

      )}
      <h1>{messages}</h1>
    </div>
  );
};

export default Chat;