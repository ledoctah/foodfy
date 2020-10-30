const dotenv = require('dotenv');
const express = require('express');
const nunjucks = require('nunjucks');
const methodOverride = require('method-override');
const flash = require('express-flash');

dotenv.config(); //load environment variables

const routes = require('./routes');
const session = require('./config/session');
const sessionMiddleware = require('./app/middlewares/session');

const server = express();

server.use(session);
server.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

server.use(flash());

server.use(express.urlencoded({ extended: true }));
server.use(express.static('public'));
server.use(methodOverride('_method'));
server.use(sessionMiddleware.isLogged);
server.use(routes);

server.set('view engine', 'njk');

nunjucks.configure('src/app/views', {
    express: server,
    autoescape: false,
    noCache: true
});

server.listen(5000, function() {
    console.log('Server is running and waiting for connections.');
})
