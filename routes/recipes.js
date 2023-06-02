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
    const recipe = await user_utils.markRecipeAsWatched(user_id,req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});


/**
 * This path returns three random recipes
 */
router.get("/randomRecipes", async (req, res, next) => {
  try {
    const randomRecipes = await recipes_utils.getRandomRecipes();
    res.send(randomRecipes);
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
    res.send(await recipes_utils.getPreviewRecipes(arrayRecipes, user_id));

  } catch (error) {
    next({ status: 400, message: "Request failed" });
  }
});

module.exports = router;
