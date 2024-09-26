require("dotenv").config();
const cors = require("cors");
const express=require("express");
// const passport=require("passport");
const app=express();
const authRouter=require("./router/auth-router.js");
const blogRouter=require("./router/blog-router.js");
const connectDB=require("./utils/db.js");

const corsOptions={
    origin:"http://localhost:3000",
    methods:"GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials:true,
}
// app.use(passport.initialize());
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/blogs", blogRouter);

connectDB().then(()=>{
    app.listen(5000, ()=>{
        console.log("server is sprinting!");
    });
});