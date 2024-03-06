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

export { Recipe, RecipeModel };
