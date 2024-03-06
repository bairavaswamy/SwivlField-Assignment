

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

export { User, UserModel };
