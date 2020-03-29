const express = require('express');
const routes = express.Router();
const multer = require('./app/middlewares/multer');

const SiteController = require('./app/controllers/SiteController');
const RecipesController = require('./app/controllers/RecipesController');
const ChefsController = require('./app/controllers/ChefsController');

routes.get('/', SiteController.trending);
routes.get('/recipes', SiteController.index);
routes.get('/chefs', SiteController.chefs);
routes.get('/about', SiteController.about);
routes.get('/recipes/:id', SiteController.show);

routes.get('/admin', function(req, res) { return res.redirect('/admin/recipes') });

routes.get('/admin/recipes', RecipesController.index)
routes.get('/admin/recipes/create', RecipesController.create);
routes.post('/admin/recipes', multer.array("photo", 5), RecipesController.post);
routes.get('/admin/recipes/:id', RecipesController.show);
routes.get('/admin/recipes/:id/edit', RecipesController.edit);
routes.put('/admin/recipes', multer.array("photo", 5), RecipesController.put);
routes.delete('/admin/recipes', RecipesController.delete);

routes.get('/admin/chefs', ChefsController.index);
routes.get('/admin/chefs/create', ChefsController.create);
routes.post('/admin/chefs', multer.array("avatar", 1), ChefsController.post);
routes.get('/admin/chefs/:id', ChefsController.show);
routes.get('/admin/chefs/:id/edit', ChefsController.edit);
routes.put('/admin/chefs', multer.array("avatar", 1), ChefsController.put);
routes.delete('/admin/chefs', ChefsController.delete);

module.exports = routes;