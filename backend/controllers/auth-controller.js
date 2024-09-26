const { json } = require("express");
const User = require("../models/user-model");
const { use } = require("../router/auth-router");
const bcrypt=require("bcrypt");
const { Navigate} = require("react-router-dom");

const home=async(req, res)=>{
    try{
        res.send("home");
        
    }
    catch(error){
        res.status(400);
    }
}

const register=async(req, res)=>{
    try{
        const {username, email, phone, password}=req.body; //post kia therefore hum nikal paa rahe
        //check if user already exists
        const userExist=await User.findOne({email:email});
        if(userExist){
            return res.status(400).json({msg:"email already exists"});
        }
        const userCreated=await User.create({username, email, phone, password});
        // console.log(userCreated);
        const token = await userCreated.generateToken();
        // console.log(token);
        const userToReturn = {...userCreated.toJSON(), token};
        res.status(200).
        json(userToReturn);
        //.json({data});
    }
    catch(error){
        res.status(500).send("internal server error");
    }
}

const login=async(req, res)=>{
    try{
        const {email, password}=req.body;
        console.log(2);
        const userExist=await User.findOne({email:email});
        if(!userExist){
            return res.status(400).json({msg:"Invalid Credentials"});
        }
        const user=await bcrypt.compare(password, userExist.password);
        console.log(user);
        if(user){
            console.log("user is present");
            const token = await userExist.generateToken();
            const userToReturn = {...userExist.toJSON(), token};
            res.status(200).json({
                msg:"Login Successful!",
                token:token,
                user:userToReturn
            })
        }
        else{
            console.log("user not present");
            res.status(401).json({
                msg:"invalid email or password",
            })
        }
    }
    catch(error){
        console.error(error);
        res.status(500).send("internal server error");
        
    }
}


module.exports={register, home, login};