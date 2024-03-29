

import mongoose from "mongoose";

class User {
    constructor(username, name, age, password, gender, location) {
        this.username = username;
        this.name = name;
        this.age = age;
        this.password = password;
        this.gender = gender;
        this.location = location;
    }
}

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    gender: {
        type:String,
        required:true
    },
    location: {
        type:String,
        required:true
    }
});

const UserModel = mongoose.model("users", UserSchema);

const saveInDb = async (user) =>{
    try{
        const newUser = new UserModel({
            username:user.username,
            name: user.name,
            age: user.age,
            password: user.password,
            gender: user.gender,
            location: user.location
        });
        await newUser.save();
        return { success: true, message: "User successfully registered" };
    }catch(error){
        return { success: false, message: `Error registering user: ${error.message}` };
    }
}

export { User,saveInDb, UserModel };
