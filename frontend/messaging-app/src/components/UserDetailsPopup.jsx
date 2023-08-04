import React from 'react';
import Modal from 'react-modal';
import '../css/UserDetailsPopup.css'

const UserDetailsPopup = ({ user, isOpen, onRequestClose }) => {

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className='custom-modal'
      contentLabel='User Details'
    >
      <button onClick={onRequestClose}>
        Close
      </button>
      <div>
        <h2>Profile Details</h2>
        <p>Name: {user.first_name} {user.last_name}</p>
        <p>Username: {user.username}</p>
        <p>Email: {user.email}</p>
      </div>
    </Modal>
  );
};

export default UserDetailsPopup;

