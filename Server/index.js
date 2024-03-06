import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User,UserModel } from "./userModel.js";
import { Recipe,RecipeModel } from "./recipeModel.js";
import config from "./config.js";
const app = express();
app.use(express.json())

 mongoose.connect(config.mongodbUri)
 .then(() => {
    console.log("Connected to MongoDB");
})
.catch(error => {
    console.log("MongoDB connection error:", error);
});
app.listen(3000)

const userAuthenication = (request,response,next) =>{
    let jwtToken;
    const authToken = request.headers["authorization"]
    if(authToken !== undefined){
        jwtToken = authToken.split(" ")[1]
    }
    if(jwtToken === undefined){
        response.status(401).send("Invalid JWT Token")
    }else{
        jwt.verify(jwtToken,"MY_TOKEN",async(error,payload)=>{
            if(error){
                response.status(401).send("Invalid JWT Token")
            }else{
                next()
            }
        })
    }
}

app.post("/register",async (request,response)=>{
    try{
        const {username,name,age,password,gender,location} = request.body
        const hashPassword = await bcrypt.hash(password,10)
        const isAlreadyUser = await UserModel.findOne({username})
        if(isAlreadyUser === null){
            const newUser = new User({
                username,
                name,
                age,
                password:hashPassword,
                gender,
                location
            });
            await newUser.save();
            response.status(200).send("User Successfully Registred")
        }else{
            response.status(400).send("User Already Exists")
        }
    }catch(error){
        response.send("query releated errors")
    }
})

app.post("/login",async (request,response)=>{
    const {username,password} = request.body
    const user = await UserModel.findOne({username})
    if(user === null){
        response.status(400).send("Invalid user")
    }else{
        const passwordCheck = await bcrypt.compare(password,user.password)
        if(passwordCheck === true){
            const payload = {
                username:username,
            }
            const JwtToken = jwt.sign(payload,"MY_TOKEN")
            response.send({JwtToken})
        }else{
            response.status(400).send("Invalid Password")
        }
    }
})

app.put("/change-username", userAuthenication, async (request, response) => {
    try {
        const { oldUsername, newUsername} = request.body;
        const updatedUsername = await UserModel.findOneAndUpdate(
            { username: oldUsername },
            { $set: { username:  newUsername } },
            { new: true }
        );

        if (updatedUsername) {
            response.status(200).send("Username Successfully Updated");
        } else {
            response.status(404).send("Username Not Found");
        }
    } catch (error) {
        console.error("Query Error:", error);
    }
});


app.get("/recipes",userAuthenication, async (request,response)=>{
    try {
        const allRecipies = await RecipeModel.find();
        response.send(allRecipies);
     } catch (error) {
        console.log("Query Error");
    }
})

app.get("/recipes/:title", userAuthenication, async (request, response) => {
    try {
        const title = request.params.title;
        const recipe = await RecipeModel.findOne({ title });

        if (recipe) {
            response.send(recipe);
        } else {
            response.status(404).send("Recipe not found");
        }
    } catch (error) {
        console.log("Query Error:", error);
    }
});

app.post("/recipes",userAuthenication, async (request,response)=>{
    try {
        const {title,description,ingredients,images} = request.body
        const newRecipe = new Recipe({
            title,
            description,
            ingredients,
            images
        })
        await newRecipe.save();
            response.status(200).send("Recipe Successfully Added")
     } catch (error) {
        console.log("Query Error");
    }
})

app.delete("/recipes",userAuthenication, async (request,response)=>{
    try {
        const {title} = request.body
        const deleteRecipe = await RecipeModel.findOneAndDelete({title})
        if(deleteRecipe){
            response.status(200).send("Recipe Successfully Deleted")
        }else{
            response.status(404).send("Recipe Not Found")
        }
     } catch (error) {
        console.log("Query Error");
    }
})

app.put("/recipes" ,userAuthenication, async (request, response) => {
    try {
        const { oldTitle, newTitle } = request.body;
        const updatedRecipe = await RecipeModel.findOneAndUpdate(
            { title: oldTitle },
            { $set: { title: newTitle } },
            { new: true }
        );

        if (updatedRecipe) {
            response.status(200).send("Recipe Title Successfully Updated");
        } else {
            response.status(404).send("Recipe not found");
        }
    } catch (error) {
        console.error("Query Error:", error);
    }
});
