const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";
const DButils = require("./DButils");



/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}

async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,     
    }
}

async function getRandomRecipes(){
    let url=`${api_domain}/random?number=3&apiKey=${process.env.spooncular_apiKey}`; // choose 3 random Recipes
    const data1= await axios.get(url)
    let res=[]
    console.log(data1.data["recipes"].length)
    for (let i = 0; i< data1.data["recipes"].length; i++){
        res.push(await getRecipeDetails( data1.data["recipes"][i].id))
    } 
    return res
}

async function getRecipesFromLastWatched() {
    const query = "SELECT * FROM LastWatch ORDER BY date DESC LIMIT 3";
    const result = await DButils.execQuery(query);
    return result;
  }




async function getFromSearchRecipes({ searchTerm, quantity, cuisine, diet, intolerances, sortBy }) {
    const finalQuantity = quantity ? quantity : 5;

    const data = await axios.get(`${api_domain}/complexSearch`, {
        params: {
            query: searchTerm,
            number: finalQuantity,
            cuisine: cuisine,
            diet: diet,
            intolerances: intolerances,
            instructionsRequired: true,
            addRecipeInformation: true,
            sort: sortBy,
            apiKey: process.env.spooncular_apiKey
        }
    });
    return data.data.results;
}

async function getPreviewRecipes(arrayRecipes, user_id) {
    const arrayPreviewRecipes = arrayRecipes.map(recipe => {
        return {
            recipe_id: recipe.id,
            name: recipe.title,
            preparationTimeInMinutes: recipe.readyInMinutes,
            imageURL: recipe.image,
            numOfLikes: recipe.aggregateLikes,
            vegan: recipe.vegan,
            vegetarian: recipe.vegetarian,
            glutenFree: recipe.glutenFree,
            favorite: false,
            watched: false
        };
    });

    if (user_id) {
        const favoriteRecipes = await DButils.execQuery(`select recipe_id from favoriterecipes where user_id = '${user_id}'`);
        const watchedRecipes = await DButils.execQuery(`select recipe_id from lastwatch where user_id = '${user_id}'`);
        arrayPreviewRecipes.forEach(recipe => {
            if (favoriteRecipes.find(element => element.recipe_id === recipe.recipe_id)) {
                recipe.favorite = true;
            }
            if (watchedRecipes.find(element => element.recipe_id === recipe.recipe_id)) {
                recipe.watched = true;
            }
        });
    }
    return arrayPreviewRecipes;
}


exports.getRecipeDetails = getRecipeDetails;
exports.getRandomRecipes = getRandomRecipes;
exports.getRecipesFromLastWatched = getRecipesFromLastWatched;
exports.getFromSearchRecipes = getFromSearchRecipes;
exports.getPreviewRecipes = getPreviewRecipes;

