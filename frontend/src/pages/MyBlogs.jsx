import React from 'react';
import { useState, useEffect } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer"
import { useNavigate } from 'react-router-dom';

export default function MyBlogs() {
    const [myblogs, setMyblogs]=useState([]);
    const [message, setMessage]=useState('');
    const navigate=useNavigate();
    useEffect(()=>{
        fetchBlogs();
    }, []);

    const fetchBlogs=()=>{
        const token=localStorage.getItem('token');
        fetch('http://localhost:5000/api/blogs/myPosts',{
            method:'GET',
            headers:{
                'Authorization': `Bearer ${token}`,
                'Content-Type': `application/json`,
            },
        })
        .then(response=>response.json())
        .then(data=>setMyblogs(data))
        .catch(error=>console.error("error fetching blogs"));
    }

    // console.log(myblogs);
    
    const handleUpdate=(id)=>{
        navigate('/update',{state:{id}});
    }

    const handleDelete=async(id)=>{
        try{
            console.log(id);
            
            const response=await fetch('http://localhost:5000/api/blogs/delete',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({id}),
            });
            const data=await response.json();
            if (response.ok) {
                setMessage('Blog deleted successfully');
                fetchBlogs(); // Refresh the list of blogs
            } else {
                setMessage('Error deleting blog');
            }
        }
        catch(error){
            console.error(error);
        }
    }
  return (
        <div>
            <Header />
            <div className="my-blogs-container">
                <h1 className="my-blogs-title">My Blogs</h1>
                {message && <p className="message">{message}</p>}
                <div className="my-blogs-list">
                    {myblogs.length && myblogs.map(myblog => (
                        <div key={myblog._id} className="blog-item">
                            <h2 className="blog-title">{myblog.title}</h2>
                            <p className="blog-content">{myblog.content}</p>
                            <button onClick={() => handleUpdate(myblog._id)} className="update-button">Update</button>
                            <button onClick={() => handleDelete(myblog._id)} className="delete-button">Delete</button>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
  )
}
