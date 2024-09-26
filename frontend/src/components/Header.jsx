import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../index.css'; // Import the CSS file

const Header = () => {
  const [isLoggedIn, setIsLoggedIn]=useState(false);

  useEffect(()=>{
    const token=localStorage.getItem('token');
    if(token) setIsLoggedIn(true);
    else setIsLoggedIn(false);
  }, []);

  return (
    <header className="header">
      <h1 className="logo">DevHub</h1>
      <nav className="nav">
        <Link to="/" className="nav-link">All Articles</Link>
        <Link to="/createBlog" className="nav-link">Create Article</Link>
        <Link to="/myBlogs" className="nav-link">My Articles</Link>
        {
          isLoggedIn? (<Link to="/login" className="nav-link">Logout</Link>)
          :(  <>
              <Link to="/register" className="nav-link">Register</Link>
              <Link to="/login" className="nav-link">Login</Link>
              </>
          )
        }
      </nav>
    </header>
  );
};

export default Header;
