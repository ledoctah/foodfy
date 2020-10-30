const express = require('express');
const routes = express.Router();

const site = require('./site');
const admin = require('./admin');
const session = require('./session');

routes.use('/', site);
routes.use('/', session);
routes.use('/admin', admin);

module.exports = routes;