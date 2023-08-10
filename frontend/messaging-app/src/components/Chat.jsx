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
    const room = getGroup(userId,selectedUser.id);
    setRoom(room)
    const token = localStorage.getItem('token');

    // Fetch messages from the backend for the room
    axios.get(`http://127.0.0.1:8000/api/messages/${room}`,{
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => {
        //update the messages state
        const fetchedMessages = response.data;
        setMessages(fetchedMessages);
      })
      .catch((error) => {
        console.error('Error fetching messages:', error);
      });

  }, [userId,selectedUser]);

  

  const wsUrl = room ? `ws://127.0.0.1:8000/ws/${room}/` : null;
  const webSocketOptions = {
    queryParams: { token }
  };
  const { sendMessage, lastMessage } = useWebSocket(wsUrl, webSocketOptions);



  useEffect(() => {
    if (lastMessage !== null) {
      // Handle incoming messages from the WebSocket server
      const messageData = JSON.parse(lastMessage.data);
      if(messageData.action && messageData.action === "delete")
      {
        // Delete the message with messageData.message_id from the messages state
        setMessages((prevMessages) =>
        prevMessages.filter((message) => message.id !== messageData.message_id)
        );
      }
      // Here, you can update the state or display the messages as you like
      else
      {
        setMessages((prevMessages) => [...prevMessages, messageData]);
      }
      
    }
  }, [lastMessage]);

  
// function to send the message
  const handleSend = () => {
    if (inputMessage.trim() !== '') {
      // create the timestamp
      const dateIST = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
      const dateString = dateIST.toISOString();
      // Send the message to the WebSocket server
      sendMessage(
        JSON.stringify({
          type: "message",
          message: inputMessage,
          username: username,
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

    // Subtract the hours to convert to Indian Standard Time (IST)
    const timeZoneOffset = 5.5 * 60 * 60 * 1000; // Indian Standard Time (IST) offset in milliseconds
    const localTime = new Date(date.getTime() - timeZoneOffset);

    const options = {
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'short',
      year: '2-digit',
    };
    return localTime.toLocaleString('en-IN', options);
    };

  // function to send the delete request for the message
  const handleDelete = (message_id) => {
    sendMessage(
      JSON.stringify({
        type: "delete",
        message_id: message_id,
      })
    );

  }

  return (
    <div>
      <div className='recepient'>{selectedUser.first_name} {selectedUser.last_name}</div>
      <div className='chatbox'>
        <div className="message-list">
          {messages.map((message, index) => (
            <div key={index} className="message">
              <p>
              {message.username}: {message.message} : {formatTimestamp(message.timestamp)}

              {message.username===username? <input type="button" value="delete" onClick={() => handleDelete(message.id)}/> : ""}
              
              </p>
            </div>
          ))}
        </div>
      </div>
      
      <div className='input-section'>
        <input className='msg-box' placeholder='Type your message here...'
          type="text"
          value={inputMessage}
          onChange={(event) => setInputMessage(event.target.value)}
        />
        <button className='send-btn' type="submit" onClick={handleSend}>
          Send
        </button>
      </div>
      
    </div>
  );
};

export default Chat;
