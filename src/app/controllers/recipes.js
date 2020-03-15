const Recipe = require('../models/Recipe');

module.exports = {
    index(req, res) {
        
        /*Recipe.all(function(recipes) {
            return res.render('admin/recipes/index', { recipes });
        })*/

        let { filter, page, limit } = req.query;

        page = page || 1;
        limit = limit || 6;
        let offset = limit * (page - 1);

        const params = {
            filter,
            limit,
            offset,
            callback(recipes) {

                const pagination = {
                    total: Math.ceil(recipes[0].total / limit),
                    page,
                    filter
                }

                return res.render('admin/recipes/index', { recipes, pagination });

            }
        }

        Recipe.paginate(params);
    
    },
    create(req, res) {

        Recipe.chefsSelectOptions(function(chefs) { 

            return res.render('admin/recipes/create', { chefs });

        });
        
    },
    post(req, res) {

        const keys = Object.keys(req.body);
    
        for(key of keys) {
            if(key != 'information' && req.body[key] == '') return res.send('Please, fill all fields');
        }

        let ingredients = [];
        let preparation = [];

        for(let ingredient of req.body.ingredients) {
            if(ingredient != '')
                ingredients.push(ingredient);

        }

        for(let step of req.body.preparation) {
            if(step != '')
                preparation.push(step);
        }

        const data = {
            ...req.body,
            ingredients,
            preparation
        }
    
        Recipe.create(data, function(id) {

            return res.redirect(`/admin/recipes/${id}`);

        });

    },
    show(req, res) {
        
        const { id } = req.params;

        Recipe.find(id, function(recipe) {

            if(!recipe) return res.send('Recipe not found');

            return res.render('admin/recipes/show', { recipe });

        });

    },
    edit(req, res) {

        const { id } = req.params;

        Recipe.find(id, function(recipe) {

            Recipe.chefsSelectOptions(function(chefs) {

                if(!recipe) return res.send('Recipe not found');
    
                return res.render('admin/recipes/edit', { recipe, chefs })

            });

        });

    },
    put(req, res) {
        
        const keys = Object.keys(req.body);
    
        for(key of keys) {
            if(key != 'information' && req.body[key] == '') return res.send('Please, fill all fields');
        }

        Recipe.update(req.body, function() {

            return res.redirect(`/admin/recipes/${req.body.id}`);

        });

    },
    delete(req, res) {
        
        const { id } = req.body;

        Recipe.delete(id, function() {
            
            return res.redirect(`/admin/recipes`);

        })

    }
}
