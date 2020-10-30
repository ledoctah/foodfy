const express = require('express');
const routes = express.Router();
const multer = require('./app/middlewares/multer');

const SiteController = require('./app/controllers/SiteController');
const RecipesController = require('./app/controllers/RecipesController');
const ChefsController = require('./app/controllers/ChefsController');
const SessionController = require('./app/controllers/SessionController');
const UsersController = require('./app/controllers/UsersController');

const SessionValidator = require('./app/validator/session');
const UserValidator = require('./app/validator/users');
const ChefValidator = require('./app/validator/chefs');
const RecipeValidator = require('./app/validator/recipes');

routes.get('/', SiteController.trending);
routes.get('/recipes', SiteController.index);
routes.get('/chefs', SiteController.chefs);
routes.get('/about', SiteController.about);
routes.get('/recipes/:id', SiteController.show);

routes.get('/admin', function(req, res) { return res.redirect('/admin/recipes') });

routes.get('/admin/recipes', RecipesController.index)
routes.get('/admin/recipes/create', RecipesController.create);
routes.post('/admin/recipes', multer.array("photo", 5), RecipeValidator.post, RecipesController.post);
routes.get('/admin/recipes/:id', RecipesController.show);
routes.get('/admin/recipes/:id/edit', RecipeValidator.canChange, RecipesController.edit);
routes.put('/admin/recipes', RecipeValidator.canChange, multer.array("photo", 5), RecipesController.put);
routes.delete('/admin/recipes', RecipeValidator.canChange, RecipesController.delete);

routes.get('/admin/chefs', ChefsController.index);
routes.get('/admin/chefs/create', ChefValidator.adminOnly, ChefsController.create);
routes.post('/admin/chefs', ChefValidator.adminOnly, multer.array("avatar", 1), ChefValidator.post, ChefsController.post);
routes.get('/admin/chefs/:id', ChefsController.show);
routes.get('/admin/chefs/:id/edit', ChefValidator.adminOnly, ChefsController.edit);
routes.put('/admin/chefs', ChefValidator.adminOnly, multer.array("avatar", 1), ChefValidator.put, ChefsController.put);
routes.delete('/admin/chefs', ChefValidator.adminOnly, ChefsController.delete);

routes.get('/admin/users', UsersController.index);
routes.get('/admin/users/create', UserValidator.adminOnly, UsersController.create);
routes.post('/admin/users', UserValidator.adminOnly, UserValidator.post, UsersController.post);
routes.get('/admin/users/:id/edit', UserValidator.adminOnly, UsersController.edit);
routes.put('/admin/users', UserValidator.adminOnly, UserValidator.put, UsersController.put);
routes.delete('/admin/users', UserValidator.adminOnly, UserValidator.delete, UsersController.delete);

routes.get('/login', SessionValidator.redirectLoggedUser, SessionController.loginForm);
routes.post('/login', SessionValidator.login, SessionController.login);
routes.post('/logout', SessionController.logout);
routes.get('/forgot-password', SessionController.forgotForm);
routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot);
routes.get('/password-reset', SessionController.resetForm);
routes.post('/password-reset', SessionValidator.forgot, SessionController.reset);

module.exports = routes;