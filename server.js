const express = require('express');
const nunjucks = require('nunjucks');

const server = express();
const recipes = require('./data');
    
server.use(express.static('public'));

server.set('view engine', 'njk');

nunjucks.configure('views', {
    express: server,
    autoescape: false,
    noCache: true
});

server.get('/home', function(req, res){
    return res.render('home');
});

server.get('/recipes', function(req, res){
    return res.render('recipes');
});

server.get('/about', function(req, res){
    return res.render('about');
});

server.listen(5000, function() {
    console.log('Server is running and waiting for connections.');
})