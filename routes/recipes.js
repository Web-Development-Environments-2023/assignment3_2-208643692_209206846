var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
const DButils = require("../routes/utils/DButils");
const user_utils = require("./utils/user_utils");


router.get("/", (req, res) => res.send("im here"));

/**
 * This path returns three random recipes
 */
router.get("/random", async (req, res, next) => {
  try {
    const user_id = undefined;
    const randomRecipesIds = await recipes_utils.getRandomRecipes();
    let recipes_id_array_with_details = await recipes_utils.getRecipes(randomRecipesIds);
    const results = await recipes_utils.getPreviewRecipes(recipes_id_array_with_details,user_id);
    res.send(results);
  } catch (error) {
    next(error);
  }
});

router.get("/searchRecipes", async (req, res, next) => {
  try {
    const arrayRecipes = await recipes_utils.getFromSearchRecipes(req.query);
    if (arrayRecipes.length == 0) {
      throw { status: 404, message: "No recipes found" };
    }
    const user_id = req.session.user_id;
    res.send(await recipes_utils.getPreviewRecipes(arrayRecipes, user_id));

  } catch (error) {
    next({ status: 400, message: "Request failed" });
  }
});

/**
 * Version with save to last watch
 * not sure but i did that this function will save the last watch to table 
 * workind
 */
router.get("/:recipeId", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe_id = req.params.recipeId
    const recipe = await recipes_utils.getRecipeDetails(recipe_id)
    if(req.session && req.session.user_id){
      await user_utils.markRecipeAsWatched(user_id,recipe_id);
    }
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

/**
 * get options for recipe search
 */
router.get('/Options/RecipeSearch', async (req,res,next)=>{
  try {
    const options = await recipes_utils.getOptions();
    res.send(options);
  } catch (error) {
    next(error);
  }
})

module.exports = router;
