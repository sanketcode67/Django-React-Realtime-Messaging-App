import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/login/', {
        username,
        password,
      });


      // Store the token in the browser's local storage for later use
      localStorage.setItem('token', response.data["token"]);

    // Redirect to the welcome page after successful login
        navigate('/welcome', { state: { username : response.data["username"] } });


    } catch (error) {
      console.error('Login failed:', error);
      
    //   handle the login error ans error in state
        setErrorMessage('Invalid username or password');
    }
  };

  return (
    <div className='login'>
        <div className='login-card'>
        <h2>Login Form</h2>
        <form className="login-form" onSubmit={handleLogin}>
            <div className='form-group'>
                <label>Username:</label>
                <input type="text" value={username} onChange={handleUsernameChange} />
            </div>
            <div className='form-group'>
                <label>Password:</label>
                <input type="password" value={password} onChange={handlePasswordChange} />
            </div>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <button type="submit">Login</button>
        </form>
        </div>
    </div>
  );
};

export default Login;
