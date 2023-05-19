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

async function addRecipeToLastWatched(user_id, recipe_id){ // try to make a query that maintain just the last three objects
    const recipes_id = await getRecipesFromLastWatched(user_id);
    if( recipe_id.length() < 3){
        await DButils.execQuery(`insert into LastWatch values ('${user_id}',${recipe_id})`);
    }
    else{
        await DButils.execQuery(`DELETE FROM LastWatch WHERE user_id='${recipes_id[0]}'`);
        await DButils.execQuery(`insert into LastWatch values ('${user_id}',${recipe_id})`);
    }
     
}

async function getRecipesFromLastWatched(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from LastWatch where user_id='${user_id}'`);
    return recipes_id;
}


//i am not sure if we want that each member of the family will have link to the same recipes:

// async function markAsFamilyRecipe(family_id, recipe_id, user_id){ // i have added the user id too, so if we want to know who is the recipe
//     // i think for it to work good we need to add users table family number that it connect to.
//     // when the user want to add recipe we will take the family number and add to there
//     await DButils.execQuery(`insert into FamilyRecipesTable values ('${family_id}',${recipe_id},${user_id})`); 
// }

// async function getFamilyRecipes(family_id){
//     const recipes_id = await DButils.execQuery(`select recipe_id from FamilyRecipesTable where family_id='${family_id}'`);
//     return recipes_id;
// }




exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;

exports.markAsFamilyRecipe = markAsFamilyRecipe;
exports.getFamilyRecipes = getFamilyRecipes;

exports.addRecipeToLastWatched = addRecipeToLastWatched;
exports.getRecipesFromLastWatched = getRecipesFromLastWatched;