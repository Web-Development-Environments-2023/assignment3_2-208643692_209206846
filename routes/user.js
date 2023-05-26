var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

/**
 * Authenticate all incoming requests by middleware
 */
// router.use(async function (req, res, next) {
//   if (req.session && req.session.user_id) {
//     DButils.execQuery("SELECT user_id FROM users").then((users) => {
//       if (users.find((x) => x.user_id === req.session.user_id)) {
//         req.user_id = req.session.user_id;
//         next();
//       }
//     }).catch(err => next(err));
//   } else {
//     res.sendStatus(401);
//   }
// });


/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/favorites', async (req,res,next) => {
  try{
    const user_id = req.body.user_id;
    // const user_id = req.session.user_id; // todo: when client side will be coded do authenticate with session remark auth above
    const recipe_id = req.body.recipe_id;
    await user_utils.markAsFavorite(user_id,recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.get('/favorites/:user_id', async (req,res,next) => {
  try{
    // const user_id = req.session.user_id;
    const user_id = req.params.user_id
    console.log("user_id: " + user_id)
    let favorite_recipes = {};
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    console.log(recipes_id)
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    // const results = await recipe_utils.getRecipesPreview(recipes_id_array); 
    const results = recipes_id_array
    res.status(200).send(JSON.stringify(results)); // todo change
  } catch(error){
    next(error); 
  }
});

/**
 * This path gets body with recipeId and save this recipe in the Family table of the logged-in user
 */
router.post('/MyFamilyRecipes', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsFamilyRecipe(user_id, recipe_id);
    res.status(200).send("The Recipe successfully saved as family recipe");
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the family recipes that were saved by the logged-in user
 */
router.get('/MyFamilyRecipes', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    // let favorite_recipes = {};
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});



// like what i thought in user_utils.js

// /**
//  * This path gets body with recipeId and save this recipe in the Family table of the logged-in user
//  */
// router.post('/MyFamilyRecipes', async (req,res,next) => {
//   try{
//     const family_id = req.session.family_id;
//     const user_id = req.session.user_id;
//     const recipe_id = req.body.recipeId;
//     await user_utils.markAsFamilyRecipe(family_id, recipe_id, user_id);
//     res.status(200).send("The Recipe successfully saved as family recipe");
//     } catch(error){
//     next(error);
//   }
// })

// /**
//  * This path returns the family recipes that were saved by the logged-in user
//  */
// router.get('/MyFamilyRecipes', async (req,res,next) => {
//   try{
//     // const user_id = req.session.user_id; for case specific recipe
//     const family_id = req.session.family_id;
//     let favorite_recipes = {};
//     const recipes_id = await user_utils.getFavoriteRecipes(family_id);
//     let recipes_id_array = [];
//     recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
//     const results = await recipe_utils.getRecipesPreview(recipes_id_array);
//     res.status(200).send(results);
//   } catch(error){
//     next(error); 
//   }
// });

/**
 * not sure but i did that this function will save the last watch to table 
 */
router.post("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);

    const user_id = req.session.user_id;
    user_utils.addRecipeToLastWatched(user_id, req.params.recipeId)

    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns three randome recipes on each click
 */
router.get('/lastWatched', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipes_id = await user_utils.getRecipesFromLastWatched(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});





module.exports = router;
