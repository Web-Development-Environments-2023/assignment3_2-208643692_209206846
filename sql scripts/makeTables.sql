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

CREATE TABLE recipeoptions (
    option_type VARCHAR(255),
    choice VARCHAR(255)
);

INSERT INTO recipeoptions (option_type, choice)
VALUES
    ('Cuisines', 'African'),
    ('Cuisines', 'Asian'),
    ('Cuisines', 'American'),
    ('Cuisines', 'British'),
    ('Cuisines', 'Cajun'),
    ('Cuisines', 'Caribbean'),
    ('Cuisines', 'Chinese'),
    ('Cuisines', 'Eastern European'),
    ('Cuisines', 'European'),
    ('Cuisines', 'French'),
    ('Cuisines', 'German'),
    ('Cuisines', 'Greek'),
    ('Cuisines', 'Indian'),
    ('Cuisines', 'Irish'),
    ('Cuisines', 'Italian'),
    ('Cuisines', 'Japanese'),
    ('Cuisines', 'Jewish'),
    ('Cuisines', 'Korean'),
    ('Cuisines', 'Latin American'),
    ('Cuisines', 'Mediterranean'),
    ('Cuisines', 'Mexican'),
    ('Cuisines', 'Middle Eastern'),
    ('Cuisines', 'Nordic'),
    ('Cuisines', 'Southern'),
    ('Cuisines', 'Spanish'),
    ('Cuisines', 'Thai'),
    ('Cuisines', 'Vietnamese');


INSERT INTO recipeoptions (option_type, choice)
VALUES
    ('Intolerances', 'Dairy'),
    ('Intolerances', 'Egg'),
    ('Intolerances', 'Gluten'),
    ('Intolerances', 'Grain'),
    ('Intolerances', 'Peanut'),
    ('Intolerances', 'Seafood'),
    ('Intolerances', 'Sesame'),
    ('Intolerances', 'Shellfish'),
    ('Intolerances', 'Soy'),
    ('Intolerances', 'Sulfite'),
    ('Intolerances', 'Tree Nut'),
    ('Intolerances', 'Wheat');


INSERT INTO recipeoptions (option_type, choice)
VALUES
    ('Diet Definitions', 'Gluten Free'),
    ('Diet Definitions', 'Ketogenic'),
    ('Diet Definitions', 'Vegetarian'),
    ('Diet Definitions', 'Lacto-Vegetarian'),
    ('Diet Definitions', 'Ovo-Vegetarian'),
    ('Diet Definitions', 'Vegan'),
    ('Diet Definitions', 'Pescetarian'),
    ('Diet Definitions', 'Paleo'),
    ('Diet Definitions', 'Primal'),
    ('Diet Definitions', 'Low FODMAP'),
    ('Diet Definitions', 'Whole30');
