const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${user_id}',${recipe_id})`);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where user_id='${user_id}'`);
    return recipes_id;
}

async function markAsFamilyRecipe(user_id, recipe_id){
    await DButils.execQuery(`insert into FamilyRecipesTable values ('${user_id}',${recipe_id})`); 
}

async function getFamilyRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from FamilyRecipesTable where user_id='${user_id}'`);
    return recipes_id;
}

exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;

exports.markAsFamilyRecipe = markAsFamilyRecipe;
exports.getFamilyRecipes = getFamilyRecipes;