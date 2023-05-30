var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
const DButils = require("../routes/utils/DButils");

router.get("/", (req, res) => res.send("im here"));


/**
 * This path returns a full details of a recipe by its id
 */
// router.get("/:recipeId", async (req, res, next) => {
//   try {
//     const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
//     res.send(recipe);
//   } catch (error) {
//     next(error);
//   }
// });

/**
 * Version with save to last watch
 * not sure but i did that this function will save the last watch to table 
 * workind
 */
router.get("/:recipeId", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe = await recipes_utils.getRecipeDetailsDecorator(user_id,req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

/**
 * This path creates a new recipe
 */
// TODO: check if needed, maybe not a request
// TODO: move to user functions
router.post("/createRecipe", async (req, res, next) => {
  try {
    let recipe_details = {
      // TODO: use counter for recipe ids (?)
      // TODO: check when to add viewed/favorite/ingredients/instructions/mealsQuantity
      id: req.body.id,
      title: req.body.title,
      readyInMinutes: req.body.readyInMinutes,
      image: req.body.image,
      popularity: req.body.popularity,
      vegan: req.body.vegan,
      vegetarian: req.body.vegetarian,
      glutenFree: req.body.glutenFree,
    }
    let recipes = [];
    recipes = await DButils.execQuery("SELECT id from recipes");

    // not relevant with counter
    if (recipes.find((x) => x.id === recipe_details.id))
      throw { status: 409, message: "Id taken" };

    await DButils.execQuery(
      `INSERT INTO recipes VALUES ('${recipe_details.id}', '${recipe_details.title}', '${recipe_details.readyInMinutes}',
      '${recipe_details.image}', '${recipe_details.popularity}', '${recipe_details.vegan}', '${recipe_details.vegetarian}',
      '${recipe_details.glutenFree}')`
    );
    res.status(201).send({ message: "recipe created", success: true });
  } catch (error) {
    next(error);
  }
});


/**
 * This path returns five random recipes
 */
router.get("/randomRecipes", async (req, res, next) => {
  try {
    const randomRecipes = await recipes_utils.getRandomRecipes();
    res.send(randomRecipes);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
