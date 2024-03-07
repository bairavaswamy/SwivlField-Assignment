

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
    username: String,
    name: String,
    age: Number,
    password: String,
    gender: String,
    location: String
});

const UserModel = mongoose.model("users", UserSchema);

const saveInDb = async (user) =>{
    try{
        const newUser = new UserModel({
            username:user.username,
            name: userInstance.name,
            age: userInstance.age,
            password: userInstance.password,
            gender: userInstance.gender,
            location: userInstance.location
        });
        await newUser.save();
        return { success: true, message: "User successfully registered" };
    }catch(error){
        return { success: false, message: `Error registering user: ${error.message}` };
    }
}

export { User,saveInDb, UserModel };
