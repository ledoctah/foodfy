const express = require('express');
const routes = express.Router();
const multer = require('../app/middlewares/multer');

const UsersController = require('../app/controllers/UsersController');
const ChefsController = require('../app/controllers/ChefsController');
const RecipesController = require('../app/controllers/RecipesController');

const UserValidator = require('../app/validator/users');
const ChefValidator = require('../app/validator/chefs');
const RecipeValidator = require('../app/validator/recipes');

routes.get('/', (req, res) => res.redirect('/admin/recipes'));

//admin users route
routes.get('/users', UsersController.index);
routes.get('/users/create', UserValidator.adminOnly, UsersController.create);
routes.post('/users', UserValidator.adminOnly, UserValidator.post, UsersController.post);
routes.get('/users/:id/edit', UserValidator.adminOnly, UsersController.edit);
routes.put('/users', UserValidator.adminOnly, UserValidator.put, UsersController.put);
routes.delete('/users', UserValidator.adminOnly, UserValidator.delete, UsersController.delete);

//admin recipes route
routes.get('/recipes', RecipesController.index)
routes.get('/recipes/create', RecipesController.create);
routes.post('/recipes', multer.array("photo", 5), RecipeValidator.post, RecipesController.post);
routes.get('/recipes/:id', RecipesController.show);
routes.get('/recipes/:id/edit', RecipeValidator.canChange, RecipesController.edit);
routes.put('/recipes', RecipeValidator.canChange, multer.array("photo", 5), RecipesController.put);
routes.delete('/recipes', RecipeValidator.canChange, RecipesController.delete);

//admin chefs route
routes.get('/chefs', ChefsController.index);
routes.get('/chefs/create', ChefValidator.adminOnly, ChefsController.create);
routes.post('/chefs', ChefValidator.adminOnly, multer.array("avatar", 1), ChefValidator.post, ChefsController.post);
routes.get('/chefs/:id', ChefsController.show);
routes.get('/chefs/:id/edit', ChefValidator.adminOnly, ChefsController.edit);
routes.put('/chefs', ChefValidator.adminOnly, multer.array("avatar", 1), ChefValidator.put, ChefsController.put);
routes.delete('/chefs', ChefValidator.adminOnly, ChefsController.delete);

module.exports = routes;