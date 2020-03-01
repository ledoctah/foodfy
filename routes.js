const express = require('express');
const routes = express.Router();

const clientView = require('./controllers/client');
const recipes = require('./controllers/recipes');

//clientView
routes.get('/', clientView.index);
routes.get('/recipes', clientView.recipes);
routes.get('/about', clientView.about);
routes.get('/recipes/:index', clientView.showRecipe);

routes.get('/admin', recipes.index)
routes.get('/admin/recipes/create', recipes.create);
routes.post('/admin/recipes', recipes.post);
routes.get('/admin/recipes/:index', recipes.show);
routes.get('/admin/recipes/:index/edit', recipes.edit);
routes.put('/admin/recipes', recipes.put);
routes.delete('/admin/recipes', recipes.delete);

module.exports = routes;