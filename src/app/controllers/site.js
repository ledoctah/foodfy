const Recipe = require('../models/Recipe');
const Chef = require('../models/Chef');

module.exports = {
    index(req, res){

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

                return res.render('site/recipes', { recipes, pagination });

            }
        }

        Recipe.paginate(params);
        
    },
    trending(req, res){
        
        Recipe.trending(function(recipes) {
            return res.render('site/index', { recipes });
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