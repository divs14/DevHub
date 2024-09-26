const mongoose=require("mongoose");

const commentSchema=new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    content:{
        type: String,
        required:true,
    },
    date:{
        type: Date,
        default: Date.now,
    },
});

const blogSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true,
    },
    customer:{
        type:mongoose.Types.ObjectId,
        ref:"User",
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically sets the current date and time
    },
    likes: {
        type:Number,
        default: 0
    },
    dislikes: {
        type:Number,
        default: 0
    },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of user IDs who liked the post
    dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments:[commentSchema]
});

blogSchema.index({title:'text'}); //title field should be indexed for faster searches

const Blog = new mongoose.model("Blog", blogSchema);

module.exports=Blog;