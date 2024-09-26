import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

export default function BlogDetail() {
  const {id}=useParams();
  const [blog, setBlog]=useState(null);
  const [newComment, setNewComment]=useState('');

  useEffect(()=>{
    const fetchBlog=async()=>{
      try{
        const response=await fetch(`http://localhost:5000/api/blogs/${id}`);
        if(!response.ok){
          throw new Error("network respone not ok");
        }
        const data=await response.json();
        setBlog(data);
      }
      catch(error){
        console.error("Error fetching blog:", error);
      }
    };

    fetchBlog();
  }, [id]);

  const handleLike = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/blogs/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ id: id }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json(); // Get the updated blog data
        setBlog((prevBlog) => ({
            ...prevBlog,
            likes: result.likes, // Update the likes from the response
        }));
    } catch (error) {
        console.error('Error liking blog:', error);
    }
}


const handleDislike = async () => {
  try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/blogs/dislike`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ id: id }),
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const result = await response.json(); // Get the updated blog data
      setBlog((prevBlog) => ({
          ...prevBlog,
          dislikes: result.dislikes, // Update the dislikes from the response
      }));
  } catch (error) {
      console.error('Error disliking blog:', error);
  }
}


  const handleAddComment=async()=>{
    try{
      const token=localStorage.getItem('token');
      const response=await fetch(`http://localhost:5000/api/blogs/addComment`, {
        method:'POST',
        headers:{
          'Content-Type' : 'application/json',
          'Authorization' : `Bearer ${token}`,
        },
        body: JSON.stringify({id:id, comment:newComment}),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setBlog((prevBlog)=>({
        ...prevBlog,
        comments: [...prevBlog.comments, result.comments[result.comments.length-1]],
      }));
      setNewComment('');
    }
    catch(error){
      console.error('Error adding comment:', error);
    }
  }

  if(!blog) return <div>Loading...</div>

  return (
    <div className="blog-detail-container">
      <h1>{blog.title}</h1>
      <p>{blog.content}</p>
      <div className="like-dislike-buttons">
        <button onClick={handleLike}>
        <i className="fas fa-thumbs-up"></i> Like ({blog.likes})
        </button>
        <button onClick={handleDislike}>
        <i className="fas fa-thumbs-down"></i> Dislike ({blog.dislikes})
        </button>
      </div>
      <div  className="comments-section">
        <h3>Comments</h3>
        {blog.comments.map((comment, index) => (
          <div key={index} className="comment">
              <p><strong>User:</strong> {comment.content}</p>
              <p><em>{new Date(comment.date).toLocaleString()}</em></p>
          </div>
        ))}
        <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
        ></textarea>
        <button onClick={handleAddComment} className="add-comment-button">Add Comment</button>
      </div>
    </div>
  )
}
