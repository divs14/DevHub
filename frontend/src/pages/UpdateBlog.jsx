import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

export default function UpdateBlog() {
  const [blog, setBlog]=useState({title:' ', content:' '});
  const [message, setMessage]=useState('');
  const location=useLocation();
  const navigate=useNavigate();

  const {id}=location.state||{}; //retrieving blog id from state

  useEffect(()=>{
    if(id){
      fetchBlog(id);
    }
  }, [id]);

  const handleSubmit =async(e)=>{
    e.preventDefault();
    try{
      const response=await fetch('http://localhost:5000/api/blogs/update',{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body: JSON.stringify({ ...blog, id }),
      })
      if(response.ok){
        setMessage('Blog updated successfully');
        navigate('/myBlogs');
      }
      else{
        setMessage('Error updating blog');
      }
    }
    catch(error){
      console.error('Error updating blog:', error);
    }
  }

  const handleChange=(e)=>{
    const {name, value}=e.target;
    setBlog(prevBlog=>({
      ...prevBlog,
      [name]:value,
    }));
  };
  
  const fetchBlog=async(id)=>{
    try{
      const response=await fetch(`http://localhost:5000/api/blogs/${id}`,{
        method:'GET',
        headers:{
          'Content-Type':'application/json',
        },
      });
      if(response.ok){
        const data=await response.json();
        setBlog({title:data.title, content:data.content});
      }
      else{
        console.error("failed to fetch blog details");
        
      }
    }
    catch(error){
      console.error('Error fetching blog:', error);
    }
  }

  return (
    <div className="update-blog-container">
      <h1 className="update-blog-title">Update Blog</h1>
      {message && <p className="update-blog-message">{message}</p>}
      <form className="update-blog-form" onSubmit={handleSubmit}>
        <label className="form-label">
          Title:
          <input
            type='text'
            name='title'
            value={blog.title}
            onChange={handleChange}
            required
            className="form-input"
          />
        </label>
        <label className="form-label">
          Content:
          <textarea
            name="content"
            value={blog.content}
            onChange={handleChange}
            required
            className="form-textarea"
          />
        </label>
        <button type='submit' className="submit-button">Update Blog</button>
      </form>
    </div>
  )
}
