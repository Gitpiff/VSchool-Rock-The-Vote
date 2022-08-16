const mongoose = require("mongoose")
const Schema = mongoose.Schema
const bcrypt = require("bcrypt")

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    memberSince: {
        type: Date,
        default: Date.now
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})

//pre-save hook to encrypt passwords on signup
//do not use arrow functions, use the keyword function, we need to access the keyword .this, without the keyword function we do not have access to .this context
userSchema.pre("save", function(next){
    const user = this
    if(!user.isModified("password")) return next()
    //takes two arguments, what are we hashing, and the salt rounds
    bcrypt.hash(user.password, 10, (err, hash) => {
        if(err) return next(err)
        user.password = hash
        next()
    })
})

//method to check encrypted password on login
//the function tales two arguments, a string and a function
userSchema.methods.checkPassword = function(passwordAttempt, callback){
    bcrypt.compare(passwordAttempt, this.password, (err, isMatch) => {
        if(err) return callback(err)
        return callback(null, isMatch)
    })
}

//method to remove user's password for token/sending the response
//this function does not expect any parameters
userSchema.methods.withoutPassword = function(){
    const user = this.toObject()
    delete user.password
    return user
}

module.exports = mongoose.model("User", userSchema)
