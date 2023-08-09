import React from 'react'
import { Link } from 'react-router-dom';


const HomeNavbar = ({ authenticated }) => {
  return (
    <div className='home-navbar'>
        <div className="logo">WeChat</div>
        {!authenticated? <div className="navigation">
          <Link className="link" to="/#">Home</Link>
          <Link className="link" to="/#">About Us</Link>
          <Link className="link" to="/#">Contact Us</Link>
        </div>:""}
        {!authenticated?  <div className='buttons'>
            <Link className="button" to="/login">Login</Link>
            <Link className="button" to="/registration">Signup</Link>
        </div>: ""}
        
        
    </div>
  )
}

export default HomeNavbar