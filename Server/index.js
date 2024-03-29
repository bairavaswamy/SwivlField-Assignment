import express, { response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User,saveInDb,UserModel } from "./userModel.js";
import { Recipe,saveInDbR,RecipeModel } from "./recipeModel.js";
import connectionDB from "./DBSetup/DBSetup.js";
const app = express();
app.use(express.json())

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT ,()=>{
    connectionDB();
    console.log(`Server running ${PORT}`);
})

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
app.get("/", (request,response)=>{
    response.send("using routes register/ login in website and also recipes recipe/:recipename recipes delete modify name there check it out")
})

app.post("/register",async (request,response)=>{
    try{
        const {username,name,age,password,gender,location} = request.body
        if (!username || !name || !age || !password || !gender || !location) {
            return response.status(400).send("All fields are required");
        }
        const hashPassword = await bcrypt.hash(password,10)
        const isAlreadyUser = await UserModel.findOne({username})
        if(isAlreadyUser === null){
            const neUser = new User(
                username,
                name,
                age,
                hashPassword,
                gender,
                location
            );
            const condition = await saveInDb(neUser);
            if((condition).success){
                response.status(200).send("User Successfully Added")
            }else{
                response.send((condition).message)
            }
        }else{
            response.status(400).send("User Already Exists")
        }
    }catch(error){
        response.send(`query erro : ${error.message}`)
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
        const newRecipe = new Recipe(
            title,
            description,
            ingredients,
            images
        )
            const conditonR = await saveInDbR(newRecipe);
            if (( conditonR).success){
                response.status(200).send("Recipe Successfully Added")
            }else{
                response.send((conditonR).message)
            }
            
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
