const express = require('express');
const routes = express.Router();

const site = require('./site');
const admin = require('./admin');
const session = require('./session');

routes.use('/', site);
routes.use('/', session);
routes.use('/admin', admin);

routes.get('*', (req, res) => {
    res.status(404);

    let layout;

    if(req.url.includes('/admin')) layout = "layout_admin.njk";
    else layout = "layout_site.njk";

    return res.render('error/404', { layout });
})

module.exports = routes;