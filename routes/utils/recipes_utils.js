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


// /**
//  * Get 3 random recipes list from spooncular response and extract the relevant recipe data for preview
//  * @param {*} recipes_info 
// */
// async function getRecipeInformation(recipe_id) {
//     return await axios.get(`${api_domain}/${recipe_id}/information`, {
//         params: {
//             includeNutrition: false,
//             apiKey: process.env.spooncular_apiKey
//         }
//     });
// }



// async function getRecipeDetails(recipe_id) {
//     let recipe_info = await getRecipeInformation(recipe_id);
//     let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

//     return {
//         id: id,
//         title: title,
//         readyInMinutes: readyInMinutes,
//         image: image,
//         popularity: aggregateLikes,
//         vegan: vegan,
//         vegetarian: vegetarian,
//         glutenFree: glutenFree,
        
//     }
// }


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



//recipe decorator with last watch

async function getRecipesFromLastWatched(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from LastWatch where user_id='${user_id}'`);
    return recipes_id;
}

async function addRecipeToLastWatched(user_id, recipe_id){ // try to make a query that maintain just the last three objects
    const recipes_ids = await getRecipesFromLastWatched(user_id);
    const flag = recipes_ids.map((row)=> row.recipe_id.toString() === recipe_id ? true : false ).includes(true) // laready contain the recipe id
    if( !recipes_ids || recipes_ids.length < 3 && !flag){
        await DButils.execQuery(`insert into LastWatch values ('${user_id}',${recipe_id})`);
    }
    else if (!flag){
        await DButils.execQuery(`DELETE FROM LastWatch WHERE user_id='${user_id}' AND recipe_id='${recipes_ids[2].recipe_id}'`);
        await DButils.execQuery(`insert into LastWatch values ('${user_id}',${recipe_id})`);
    }
     
}


async function getRecipeFromDb(recipe_id){
    const recipes_id = await DButils.execQuery(`select id, title, readyInMinutes, image, popularity, vegan, vegetarian, glutenFree from recipes where id='${recipe_id}'`);
    return recipes_id;
}


async function getRecipeDetailsDecorator(user_id, recipe_id) {
    //if in DB return from DB
    let recipe_info = await getRecipeFromDb(recipe_id);

    let id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree;

    if (recipe_info.length === 0){ // if the recipe not in ower data base we will call external api
        recipe_info = await getRecipeInformation(recipe_id);
        ({id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree} = recipe_info.data);
    }
    else{
        ({id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree} = recipe_info[0]);
    }
    
    await addRecipeToLastWatched(user_id, recipe_id) // add recipe ro last watch recipe

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
exports.getRecipeDetailsDecorator = getRecipeDetailsDecorator;
exports.getRecipesFromLastWatched = getRecipesFromLastWatched;
exports.getFromSearchRecipes = getFromSearchRecipes;
exports.getPreviewRecipes = getPreviewRecipes;

