import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from "../src/pages/Register.jsx"
import Login from './pages/Login.jsx';
import AllBlogs from './pages/AllBlogs.jsx'
import MyBlogs from './pages/MyBlogs.jsx'
import UpdateBlog from './pages/UpdateBlog.jsx'
import CreateBlog from './pages/CreateBlog.jsx';
import BlogDetail from './pages/BlogDetail.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<AllBlogs />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/myBlogs' element={<MyBlogs />} />
        <Route path='/update' element={<UpdateBlog />} />
        <Route path='/createBlog' element={<CreateBlog />} />
        <Route path='/blog/:id' element={<BlogDetail />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

