var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipes_utils = require("./utils/recipes_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users").then((users) => {
      if (users.find((x) => x.user_id === req.session.user_id)) {
        req.user_id = req.session.user_id;
        next();
      }
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});


/**
 * This path creates a new recipe
 */
router.post("/createRecipe", async (req, res, next) => {
  try {
    let recipe_details = {
      // id: req.body.id,
      title: req.body.title,
      readyInMinutes: req.body.readyInMinutes,
      image: req.body.image,
      popularity: req.body.popularity,
      vegan: req.body.vegan,
      vegetarian: req.body.vegetarian,
      glutenFree: req.body.glutenFree,
      instructions: req.body.instructions,
      servings: req.body.servings,
      extendedIngredients: req.body.extendedIngredients
    }

    await DButils.execQuery(
      `INSERT INTO recipes (title, readyInMinutes, image, popularity, vegan, vegetarian,
        glutenFree, instructions, servings, extendedIngredients) VALUES ('${recipe_details.title}',
        '${recipe_details.readyInMinutes}', '${recipe_details.image}', '${recipe_details.popularity}',
        '${recipe_details.vegan}', '${recipe_details.vegetarian}', '${recipe_details.glutenFree}',
        '${recipe_details.instructions}', '${recipe_details.servings}', '${recipe_details.extendedIngredients}')`
    );
    res.status(201).send({ message: "recipe created", success: true });
  } catch (error) {
    next(error);
  }
});


/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id; // todo: when client side will be coded do authenticate with session remark auth above
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
router.get('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
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
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.delete('/favorites/:recipe_id', async (req,res,next) => {
  try{
    const user_id = req.session.user_id; // todo: when client side will be coded do authenticate with session remark auth above
    const recipe_id = req.params.recipe_id;
    await user_utils.deleteFavoriteRecipe(user_id,recipe_id);
    res.status(200).send("The Recipe successfully deleted as favorite");
    } catch(error){
    next(error);
  }
})


/**
 * This path returns the family recipes that were saved by the logged-in user
 */
//TODO: move to recipes
router.get('/MyFamilyRecipes', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    // const user_id = req.body.user_id;
    // let favorite_recipes = {};
    const recipes_id = await user_utils.getFamilyRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    // const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    const results = recipes_id_array
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});

/**
 * This path returns the my recipes that were saved by the logged-in user
 */
router.get('/MyRecipes', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    // let favorite_recipes = {};
    const recipes_id = await user_utils.getMyRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    // const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    const results = recipes_id_array
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});


/**
 * This path returns three randome recipes on each click
 */
router.get('/lastWatched', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipes_ids = await recipes_utils.getRecipesFromLastWatched(user_id);
    let recipes_id_array = [];
    recipes_ids.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    // const results = await recipes_utils.getRecipesPreview(recipes_id_array);
    // res.status(200).send(results);
    const results = recipes_id_array
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});





module.exports = router;
