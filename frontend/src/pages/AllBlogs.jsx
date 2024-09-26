import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AllBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [searchQ, setSearchQ]=useState('');
  const fetchBlogs=async(query)=>{
    try{
      // console.log("going");
      
      const response=await fetch(`http://localhost:5000/api/blogs/search?title=${encodeURIComponent(query)}`); //title ke naam se query bheji hai
      if(!response.ok){
        throw new Error('network response was not ok');
      }
      const data=await response.json();
      setBlogs(data);
    }
    catch(error){
      console.error("Error fetching blogs:", error);
    }
  };
    useEffect(()=>{
      fetchBlogs(''); //fetching all blogs when component mounts
    }, []);

    useEffect(()=>{
      if(searchQ) fetchBlogs(searchQ);
      else fetchBlogs('');
    }, [searchQ]);

  return (
    <div>
      <Header />
      <div className="all-blogs-container">
        <input
          type='text'
          placeholder='Search by title'
          value={searchQ}
          onChange={(e)=>setSearchQ(e.target.value)}
          className="search-bar"
        />
          <div className="blogs-list">
            {blogs.length && blogs.map(blog => (
              <div key={blog._id} className="blog-item">
                <h2>{blog.title}</h2>
                <p>{blog.content}</p>
                <Link to={`/blog/${blog._id}`} className="read-more"> {/* Change to blog._id */}
                  Read More
                </Link>
              </div>
            ))}
          </div>
      </div>
      <Footer />
    </div>
  )
}
