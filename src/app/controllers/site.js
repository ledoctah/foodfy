const Recipe = require('../models/Recipe');
const Chef = require('../models/Chef');

module.exports = {
    index(req, res){

        Recipe.trending(function(recipes) {
            return res.render('site/index', { recipes });
        })
        
    },
    recipes(req, res){
        
        const { filter } = req.query;
        
        Recipe.findBy(filter, function(recipes) {
            return res.render('site/recipes', { recipes, filter });
        })

    },
    chefs(req, res){
        
        Chef.all(function(chefs) {
            return res.render('site/chefs', { chefs });
        })

    },
    about(req, res){

        return res.render('site/about');

    },
    show(req, res) {
        
        const { id }= req.params;

        Recipe.find(id, function(recipe) {

            if(!recipe){
                return res.send('Recipe not found');
            }
            
            return res.render('site/show', { recipe });
            
        });
        
    }
}