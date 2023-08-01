import React, { useState } from 'react';
import axios from 'axios';

const Registration = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const usernamePattern = /^(?=.*[a-zA-Z])(?=.*\d).+$/;

  const handleUsernameChange = (event) => {
    const newUsername = event.target.value;
    setUsername(newUsername);

    // Validate the username using the regex pattern
    if (!usernamePattern.test(newUsername)) {

      setUsernameError('Username should contain characters and at least one number');
    } else {
      setUsernameError(''); // Clear the error message if valid
    }
  };


  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Send the signup data to the API
      const response = await axios.post('http://127.0.0.1:8000/auth/register/', {
        first_name: firstName,
        last_name: lastName,
        email: email,
        username: username,
        password: password,
      });
      // Handle the successful signup response here (e.g., show a success message)
      console.log(response.data);
    } catch (error) {
      // Handle signup error here (e.g., show an error message)
      if(error.response.data.error){
        setUsernameError(error.response.data.error || '');
      }
      else{
        console.error(error);
      }
      
    }
  };

  return (
    <div className='signup'>
      <div className='signup-card'>
        <h2>Signup Form</h2>
        <form className='signup-form' onSubmit={handleSignup}>
          <div className='form-group'>
            <label>First Name:</label>
            <input type='text' value={firstName} onChange={(e) => setFirstName(e.target.value)} required/>
          </div>
          <div className='form-group'>
            <label>Last Name:</label>
            <input type='text' value={lastName} onChange={(e) => setLastName(e.target.value)} required/>
          </div>
          <div className='form-group'>
            <label>Email:</label>
            <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} required/>
          </div>
          <div className='form-group'>
            <label>Username:</label>
            <input type='text' value={username} onChange={handleUsernameChange} required/>
            {usernameError && <p style={{ color: 'red' }}>{usernameError}</p>}
          </div>
          <div className='form-group'>
            <label>Password:</label>
            <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} required/>
          </div>
          <button type='submit'>Signup</button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
