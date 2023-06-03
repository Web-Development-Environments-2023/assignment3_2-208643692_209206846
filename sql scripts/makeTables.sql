-- SQLBook: Code
CREATE TABLE `users` (
    `user_id` int AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(255),
    `firstname` VARCHAR(255),
    `lastname` VARCHAR(255),
    `country` VARCHAR(255),
    `password` VARCHAR(255),
    `email` VARCHAR(255)
    -- `profilePic` VARCHAR(255)
);

CREATE TABLE `mydb`.`FamilyRecipesTable` (  
    recipe_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100),
    image VARCHAR(255),
    readyInMinutes INT,
    author VARCHAR(100),
    occasion VARCHAR(100),
    extendedIngredients TEXT,
    instructions TEXT
);

CREATE TABLE `mydb`.`FavoriteRecipes` (  
    `user_id` INT,
    `recipe_id` INT,
    PRIMARY KEY (`user_id`, `recipe_id`),
    FOREIGN KEY (`user_id`) REFERENCES users(`user_id`)
);

CREATE TABLE `mydb`.`LastWatch` (
  `user_id` INT NOT NULL,
  `recipe_id` INT NOT NULL,
  `date` DATETIME NOT NULL,
  PRIMARY KEY (`user_id`, `recipe_id`, `date`),
  FOREIGN KEY (`user_id`) REFERENCES users(`user_id`)
);

CREATE TABLE `recipes` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT,
    `title` VARCHAR(255),
    `readyInMinutes` FLOAT,
    `image` VARCHAR(255),
    `popularity` INT,
    `vegan` BOOL CHECK (vegan IN (0, 1)),
    `vegetarian` BOOL CHECK (vegetarian IN (0, 1)),
    `glutenFree` BOOL CHECK (glutenFree IN (0, 1)),
    `instructions` TEXT,
    `servings` INT,
    `extendedIngredients` TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
