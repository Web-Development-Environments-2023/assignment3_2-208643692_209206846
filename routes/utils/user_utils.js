const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${user_id}',${recipe_id})`);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where user_id='${user_id}'`);
    return recipes_id;
}

async function deleteFavoriteRecipe(user_id, recipe_id){
    return await DButils.execQuery(`DELETE FROM FavoriteRecipes WHERE user_id='${user_id}' AND recipe_id='${recipe_id}'`);
}

async function markAsFamilyRecipe(user_id, recipe_id){
    await DButils.execQuery(`insert into FamilyRecipesTable values ('${user_id}',${recipe_id})`); 
}

async function getFamilyRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from FamilyRecipesTable`);
    return recipes_id;
}

async function markAsMyRecipe(user_id, recipe_id){
    await DButils.execQuery(`insert into recipes values ('${user_id}',${recipe_id})`); 
}

async function getMyRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select id from recipes where user_id='${user_id}'`);
    return recipes_id;
}

async function markRecipeAsWatched(user_id, recipe_id){
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    await DButils.execQuery(`INSERT INTO LastWatch VALUES ('${user_id}', ${recipe_id}, '${currentDate}')`);
}


exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;

exports.markAsFamilyRecipe = markAsFamilyRecipe;
exports.getFamilyRecipes = getFamilyRecipes;

exports.markAsMyRecipe = markAsMyRecipe;
exports.getMyRecipes = getMyRecipes;
exports.markRecipeAsWatched = markRecipeAsWatched;
exports.deleteFavoriteRecipe = deleteFavoriteRecipe;