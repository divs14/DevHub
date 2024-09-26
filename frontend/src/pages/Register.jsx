import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Register = () => {
  const [username, setUsername]=useState("");
  const [email, setEmail]=useState("");
  const [password, setPassword]=useState("");
  const [phone, setPhone]=useState("");
  const navigate=useNavigate();

  const handle = async(e) =>{
    e.preventDefault();
    try{
      const response=await fetch(`http://localhost:5000/api/auth/register`, {
          method:"POST",
          headers:{
              "Content-Type":"application/json",
          },
          body:JSON.stringify({
              username:username,
              email: email,
              password:password,
              phone:phone,
          })
      });
      if(!response.error){
        navigate("/");
      }
  }
  catch(error){
      console.log(error);
  }
  }
  return (
      <div className="register-container">
        <Header />
        <div className="register-form">
          <form onSubmit={handle}>
            <input
              type="text"
              placeholder='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
            />
            <input
              type="email"
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
            <input
              type="password"
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
            <input
              type="text"
              placeholder='Phone'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-input"
            />
            <button type="submit" className="submit-button">Register</button>
          </form>
        </div>
        <Footer />
      </div>
  )
}

export default Register