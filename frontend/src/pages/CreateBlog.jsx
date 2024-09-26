import React, {useState} from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function CreateBlog() {
    const [title, setTitle]=useState('');
    const [content, setContent]=useState('');
    const [message, setMessage]=useState('');
    const navigate=useNavigate();

    const handlesubmit=async(e)=>{
        e.preventDefault();
        const token=localStorage.getItem('token');
        try{
            const respone=await fetch('http://localhost:5000/api/blogs/create',{
                method:'POST',
                headers:{
                    'Authorization' : `Bearer ${token}`,
                    'Content-Type' : `application/json`,
                },
                body : JSON.stringify({title, content}),
            });
            if(respone.ok){
                setMessage('Blog created successfully');
                setTitle('');
                setContent('');
                navigate('/');
            }
            else{
                setMessage('Error creating blog');
            }
        }
        catch(error){
            console.error('Error:', error);
            setMessage('Error creating blog');
        }
    }
  return (
        <div>
            <Header/>
            <div className="create-blog-container">
                <h1 className="create-blog-title">Create Blog</h1>
                {message && <p className="create-blog-message">{message}</p>}
                <form onSubmit={handlesubmit} className="create-blog-form">
                    <label className="create-blog-label">Title</label>
                    <input 
                        type='text' 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                        className="create-blog-input" 
                    />
                    <label className="create-blog-label">Content</label>
                    <textarea 
                        value={content} 
                        onChange={(e) => setContent(e.target.value)} 
                        required 
                        className="create-blog-textarea" 
                    />
                    <button type="submit" className="create-blog-button">Create Blog</button>
                </form>
            </div>
            <Footer/>
        </div>
  )
}
