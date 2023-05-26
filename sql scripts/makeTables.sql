CREATE TABLE `users` (
    `username` VARCHAR(255),
    `firstname` VARCHAR(255),
    `lastname` VARCHAR(255),
    `country` VARCHAR(255),
    `password` VARCHAR(255),
    `email` VARCHAR(255)
    -- `profilePic` VARCHAR(255)
);

CREATE TABLE `mydb`.`FamilyRecipesTable` (  
    `user_id` int NOT NULL PRIMARY KEY,
    `recipe_id` int NOT NULL);

CREATE TABLE `mydb`.`FavoriteRecipes` (  
    `user_id` int NOT NULL PRIMARY KEY,
    `recipe_id` int NOT NULL);


CREATE TABLE `mydb`.`LastWatch` (  
    `user_id` int NOT NULL PRIMARY KEY,
    `recipe_id` int NOT NULL);

CREATE TABLE `recipes` (
    `id` INT NOT NULL PRIMARY KEY,
    `title` VARCHAR(255),
    `readyInMinutes` FLOAT,
    `image` VARCHAR(255),
    `popularity` INT,
    `vegan` BOOL CHECK (vegan IN (0, 1)),
    `vegetarian` BOOL CHECK (vegetarian IN (0, 1)),
    `glutenFree` BOOL CHECK (glutenFree IN (0, 1))
);
