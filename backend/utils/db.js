const mongoose = require("mongoose");
const URI=process.env.MONGO_URI;
// console.log("hehe");
//only to connect database
const connectDB = async() =>{
    try{
        await mongoose.connect(URI);
        console.log("connection successful!");
    }
    catch(error){
        console.log(error);
        process.exit(0);
    }
};

module.exports=connectDB;