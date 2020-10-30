const express = require('express');
const routes = express.Router();

const SiteController = require('../app/controllers/SiteController');

routes.get('/', SiteController.trending);
routes.get('/recipes', SiteController.index);
routes.get('/chefs', SiteController.chefs);
routes.get('/about', SiteController.about);
routes.get('/recipes/:id', SiteController.show);

module.exports = routes;