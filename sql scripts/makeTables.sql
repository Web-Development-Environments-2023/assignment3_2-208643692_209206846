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