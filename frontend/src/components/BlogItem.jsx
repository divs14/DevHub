import React from 'react';
import '../index.css'; // Import the CSS file

const BlogItem = ({ title, content, author, date }) => {
  return (
    <div className="blog-item">
      <h2 className="blog-title">{title}</h2>
      <p className="blog-content">{content}</p>
      <div className="blog-meta">
        <span className="blog-author">By {author}</span>
        <span className="blog-date"> on {new Date(date).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default BlogItem;
