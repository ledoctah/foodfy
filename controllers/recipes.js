const fs = require('fs');
const data = require('../data.json');

exports.index = function(req, res) {
    const recipes = data.recipes;

    return res.render('admin/index', { recipes });
}

exports.create = function(req, res) {
    return res.render('admin/create');
};

exports.post = function(req, res) {
    const keys = Object.keys(req.body);

    for(key of keys) {
        if(key != 'information' && req.body[key] == '') return res.send('Please, fill all fields');
    }

    const recipe = {
        ...req.body
    }

    data.recipes.push(recipe);

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
        if(err) return res.send('Error writing file');

        return res.send('Inserted');
    });

};

exports.show = function(req, res) {
    const { index } = req.params;

    const foundRecipe = data.recipes[index-1];

    if(!foundRecipe) return res.send('Recipe not found');

    const recipe = {
        ...foundRecipe,
        index
    }

    return res.render("admin/show", { recipe });
};

exports.edit = function(req, res) {

    const { index } = req.params;

    const foundRecipe = data.recipes[index-1];

    if(!foundRecipe) return res.send('Recipe not found');

    const recipe = {
        ...foundRecipe,
        information: foundRecipe.information.replace(/\r?\n/g, '&#013;'),
        index: index,
    }

    return res.render('admin/edit', { recipe });
};

exports.put = function(req, res) {
    const { index } = req.body

    const foundRecipe = data.recipes[index-1];

    if(!foundRecipe) return res.send('Recipe not found');

    delete req.body.index;

    const recipe = {
        ...foundRecipe,
        ...req.body,
    }
console.log(req.body.information)
    data.recipes[index-1] = recipe;

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
        if(err) return res.send('Error writing json file');

        return res.redirect(`/admin/recipes/${index}`);
    });
};

exports.delete = function(req, res) {
    const { index } = req.body;

    delete data.recipes[index-1];

    if(data.recipes[0] == null) data.recipes = [];

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
        if(err) return res.send('Error writing json file');

        return res.send('deleted');
    });

};