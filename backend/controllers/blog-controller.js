const Blog = require("../models/blog-model");
const jwt=require("jsonwebtoken");

const posts=async(req, res)=>{
    try{
        const blogs=await Blog.find();
        res.status(200).json(blogs);
    }
    catch(error){
        console.error("Error finding blogs:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const myPosts=async(req, res)=>{
    try{
        const token=req.headers.authorization?.split(' ')[1];
        if(!token){
            return res.status(401).json({msg:"no token provided"});
        }
        //verify and decode the token to get the userID
        
        
        
        const decoded=jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId=decoded.userID;
        // console.log("yaha");
        // console.log(token);
        // console.log(userId);
        if (!userId) {
            return res.status(401).json({ message: "Invalid token" });
        }
        const userBlogs=await Blog.find({customer: userId});
        if(userBlogs.length==0) return res.status(404).json({msg:"no blogs found for this user"});
        res.status(200).json(userBlogs);
    }
    catch(error){
        console.error("Error fetching user's blogs:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const create=async(req, res)=>{
    try{
        const {title, content}=req.body;
        if(!title||!content){
            return res.status(400).json({message:"title and content is required"});
        }
        //requiring token so as to verify that the same user is creating the post whi has logged in and it is storing the userid of the blog created using that token only
        const token=req.headers.authorization?.split(' ')[1];
        if(!token){
            return res.status(401).json({msg:"no token provided"});
        }
        //verify and decode the token to get the userID
        
        const decoded=jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(decoded);
        
        const userId=decoded.userID;
        
        console.log(userId);
        if (!userId) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const newBlog=new Blog({
            title,
            content,
            customer:userId,
            createdAt:new Date(),
            likes:0,
            dislike:0,
            comments:[],
        });

        await Blog.create(newBlog);
        res.status(201).json({message:"blog created successfully", blog:newBlog});
    }
    catch(error){
        console.error("Error creating blog:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const update=async(req, res)=>{
    try{
        // const {id} = req.body;
        const {id, title, content}=req.body;
        //find that post having this postid from the database using mongoose
        const updatedBlog=await Blog.findByIdAndUpdate(
            id,
            {title, content}, // Update the title and content
            { new: true, runValidators: true }
        );
        console.log(updatedBlog);
        if(!updatedBlog){
            return res.status(404).json({message:"blog not found"});
        }
        //update that post and push the updated array
        res.status(200).json(updatedBlog);
    }
    catch(error){
        console.error("Error updating blog:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const remove=async(req, res)=>{
    try{
        // const {id} = req.body;
        const {id}=req.body;
        const deletedBlog=await Blog.findByIdAndDelete(id);
        console.log("id",id);
        if(!deletedBlog) return res.status(404).json({msg:"blog not found!"});
        res.status(200).json({ message: "Blog deleted successfully", deletedBlog });
    }
    catch(error){
        console.error("Error deleting blog:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const like=async(req, res)=>{
    try{
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decoded.userID;

        if (!userId) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const { id } = req.body; // Blog post ID
        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Check if the user has already liked the post
        if (blog.likedBy.includes(userId)) {
            return res.status(400).json({ message: "You have already liked this blog" });
        }

        // Remove the user from dislikedBy array if they had disliked before
        if (blog.dislikedBy.includes(userId)) {
            blog.dislikes -= 1;
            blog.dislikedBy.pull(userId);
        }

        blog.likes += 1;
        blog.likedBy.push(userId); // Add the user to likedBy array
        await blog.save();

        res.status(200).json({ message: "Blog liked successfully", likes: blog.likes });
    }
    catch(error){
        console.error("Error liking blog:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const dislike=async(req, res)=>{
    try{
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decoded.userID;

        if (!userId) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const { id } = req.body; // Blog post ID
        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Check if the user has already disliked the post
        if (blog.dislikedBy.includes(userId)) {
            return res.status(400).json({ message: "You have already disliked this blog" });
        }

        // Remove the user from likedBy array if they had liked before
        if (blog.likedBy.includes(userId)) {
            blog.likes -= 1;
            blog.likedBy.pull(userId);
        }

        blog.dislikes += 1;
        blog.dislikedBy.push(userId); // Add the user to dislikedBy array
        await blog.save();

        res.status(200).json({ message: "Blog disliked successfully", dislikes: blog.dislikes });
    }
    catch(error){
        console.error("Error disliking blog:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const addComment=async(req, res)=>{
    try{
        const {id, comment}=req.body;
        const blog=await Blog.findById(id);
        if(!blog){
            return res.status(404).json({message:"blog not found"});
        }
        //taking userId from the frontend, that is taking from JWT
        //authorization/token to frontend hi dega as localstorage of client mei stored hai toke, toh frontend access krega aur backend mei bhejega
        const token=req.headers.authorization.split(' ')[1];
        const decodedToken=jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId=decodedToken.userID;
        const newComment={
            user:userId, //////////////////////////////
            content:comment,
        };
        blog.comments.push(newComment);
        await blog.save();
        res.status(200).json({message:"comment added successfully", comments:blog.comments});
    }
    catch(error){
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const searchBlogs=async(req, res)=>{
    try{
        console.log("getting");
        const {title}=req.query;
        console.log(title);
        
        const regex=new RegExp(title, 'i'); 
        //'i' will make it case-insensitive
        //it will search whether u have written in upper case or lower case
        const blogs=await Blog.find({title:{$regex:regex}});
        // if(blogs.length===0){
        //     return res.status(404).json({msg:"no blogs found"});
        // }
        res.status(200).json(blogs);
    }
    catch(error){
        console.error('Error searching blogs:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


const getBlogById=async(req, res)=>{
    try{
        const {id}=req.params;
        const blog=await Blog.findById(id);
        if(!blog){
            return res.status(404).json({msg:"blog not found"});
        }
        res.status(200).json(blog);
    }
    catch(error){
        console.error("Error fetching blog:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports={create, update, remove, posts, myPosts, like, dislike, addComment, searchBlogs, getBlogById};