var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
const DButils = require("../routes/utils/DButils");
const user_utils = require("./utils/user_utils");


router.get("/", (req, res) => res.send("im here"));

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
    await user_utils.markRecipeAsWatched(user_id,recipe_id);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns the family recipes that were saved by the logged-in user
 */
router.get('/MyFamilyRecipes/All', async (req, res,next) => {
  try{
    const recipes_id = await user_utils.getFamilyRecipes();
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.id)); //extracting the recipe ids into array
    const results = await recipes_utils.getMyRecipes(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error);
  }
});

module.exports = router;
