import mongoose from "mongoose";

class Recipe {
    constructor(title, description, ingredients, images) {
        this.title = title;
        this.description = description;
        this.ingredients = ingredients;
        this.images = images;
    }
}

const RecipeSchema = new mongoose.Schema({
    title: String,
    description: String,
    ingredients: Array,
    images: String
});

const RecipeModel = mongoose.model("recipes", RecipeSchema);

const saveInDbR = async (recipe) =>{
    try{
        const newRecipe = new UserModel({
            title:recipe.title,
            description:recipe.description,
            ingredients:recipe.ingredients,
            images:recipe.images
        });
        await newRecipe.save();
        return { success: true, message: "Recipe successfully registered" };
    }catch(error){
        return { success: false, message: `Error registering Recipe: ${error.message}` };
    }
}

export { Recipe,saveInDbR, RecipeModel };
