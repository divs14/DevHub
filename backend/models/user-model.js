const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,  
    },
    email: {
        type: String,
        required: true,  
    },
    password: {
        type: String,
        required: true,  
    },
    phone: {
        type: String,
        required: true,  
    },
});

// Hash the password before saving the user model
userSchema.pre("save", async function(next) {
    const user = this;
    
    // Only hash the password if it has been modified (or is new)
    if (!user.isModified("password")) {
        return next();
    }
    
    try {
        const saltRound = 10;  // Defined salt rounds directly
        const hash_password = await bcrypt.hash(user.password, saltRound);
        user.password = hash_password;
        next();
    } catch (error) {
        next(error);
    }
});

// Method to generate a JWT token
userSchema.methods.generateToken = async function() {
    try {
        return jwt.sign(
            {
                userID: this._id,
                email: this.email,
            },
            process.env.JWT_SECRET_KEY,  // Secret key from the environment variable
            {
                expiresIn: "30d",  // Token expiration time
            }
        );
    } catch (error) {
        console.error("Error generating token:", error);
    }
};

// Create and export the User model
const User = mongoose.model("User", userSchema);
module.exports = User;
