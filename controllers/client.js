const data = require('../data.json');

exports.index = function(req, res){
    recipes = data.recipes;

    return res.render('user/index', { recipes });
};

exports.recipes = function(req, res){
    recipes = data.recipes;

    return res.render('user/recipes', { recipes });
};

exports.about = function(req, res){
    return res.render('user/about');
}

exports.showRecipe = function(req, res) {
    const recipeIndex = req.params.index;

    const recipe = data.recipes[recipeIndex]

    if(!recipe){
        return res.send('Recipe not found');
    }
    
    return res.render('user/recipe', { recipe });

};