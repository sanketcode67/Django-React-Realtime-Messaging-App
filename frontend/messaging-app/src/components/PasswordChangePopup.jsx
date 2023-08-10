import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import '../css/PasswordChangePopup.css';

const PasswordChangePopup = ({ isOpen, onClose, onSubmit }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState({ text: '', color: 'black' });

  const handleOldPasswordChange = (event) => {
    setOldPassword(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if(oldPassword === "")
    {
      setMessage({ text: "old password can't be empty", color: 'red' });
    }
    else if(newPassword === "")
    {
      setMessage({ text: "new password can't be empty", color: 'red' });
    }
    else if (oldPassword === newPassword) {
      setMessage({ text: 'old password and new password should not be same', color: 'red' });
     
    }
    else {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          'http://127.0.0.1:8000/auth/change-password/',
          { old_password: oldPassword, new_password: newPassword },
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
  
        if (response.status === 200) {
          setMessage({ text: response.data.message, color: 'green' });
        }
      } catch (error) {
        setMessage({ text: error.response.data.error, color: 'red' });
      }
    }


    setTimeout(() => {
      setMessage({ text: '', color: 'black' });
    }, 3000);
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className='password-change-modal' contentLabel="Change Password Modal">
      <h2>Change Password</h2>
      <div>
        <label>Old Password:</label>
        <input type="password" value={oldPassword} onChange={handleOldPasswordChange} />
      </div>
      <div>
        <label>New Password:</label>
        <input type="password" value={newPassword} onChange={handleNewPasswordChange} />
        {message ? <p style={{ color: message.color }}>{message.text}</p>: ''}
      </div>
      <button type="button" onClick={(event)=>handleSubmit(event)}>Submit</button>
    </Modal>
  );
};

export default PasswordChangePopup;
