import React, { useState, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import axios from 'axios';

const Chat = ({ selectedUser , username, userId}) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [room , setRoom] = useState("");
  const token = localStorage.getItem('token');


  

  function getGroup(currentUserId, otherUserId)
  {
    if(currentUserId < otherUserId)
    {
      return `chat_${currentUserId}_${otherUserId}`
    }
    return `chat_${otherUserId}_${currentUserId}`
  }


  useEffect(() => {
    setMessages([]);
    console.log('chat component');
    const room = getGroup(userId,selectedUser.id);
    setRoom(room)

    // Fetch messages from the backend for the room
    axios.get(`http://127.0.0.1:8000/api/messages/${room}`)
      .then((response) => {
        // Handle the response and update the messages state
        const fetchedMessages = response.data;
        console.log("fetching messages")
        console.log(fetchedMessages)
        setMessages(fetchedMessages);
      })
      .catch((error) => {
        console.error('Error fetching messages:', error);
      });

  }, [userId,selectedUser]);

  const wsUrl = `ws://127.0.0.1:8000/ws/${room}/?token=${token}`;
  const { sendMessage, lastMessage} = useWebSocket(wsUrl);




  useEffect(() => {

    if (lastMessage !== null) {
      // Handle incoming messages from the WebSocket server
      const messageData = JSON.parse(lastMessage.data);
      console.log(messageData)
      // Here, you can update the state or display the messages as you like
      setMessages((prevMessages) => [...prevMessages, messageData]);
    }
  }, [lastMessage]);

  

  const handleSend = () => {
    if (inputMessage.trim() !== '') {
      // Send the message to the WebSocket server
      const dateIST = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
      const dateString = dateIST.toISOString();
      sendMessage(
        JSON.stringify({
          message: inputMessage,
          username: username, // You may want to change this to the actual username
          room: room,
          timestamp: dateString,
        })
      );
      setInputMessage(''); // Clear the input field after sending the message
    }
  };

  // Function to format the timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'short',
      year: '2-digit',
    };
    return new Intl.DateTimeFormat('en-IN', options).format(date);
  };

  return (
    <div>
      {/* {selectedUser && (
        <div>
          <p>Selected User:</p>
          <p>User id: {selectedUser.id}</p>
          <p>First Name: {selectedUser.first_name}</p>
          <p>Last Name: {selectedUser.last_name}</p>
          <p>Username: {selectedUser.username}</p>
        </div>
      )} */}
      <div className='recepient'>{selectedUser.first_name} {selectedUser.last_name}</div>
      <div className='chatbox'>
        <div className="message-list">
          {messages.map((message, index) => (
            <div key={index} className="message">
              <p>
              {message.username}: {message.message} : {formatTimestamp(message.timestamp)}
              
              </p>
            </div>
          ))}
        </div>
      </div>
      
      <input
        type="text"
        value={inputMessage}
        onChange={(event) => setInputMessage(event.target.value)}
      />
      <button type="submit" onClick={handleSend}>
        Send
      </button>
    </div>
  );
};

export default Chat;
