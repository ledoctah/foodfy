const Recipe = require('../models/Recipe');
const Chef = require('../models/Chef');

module.exports = {
    async index(req, res){
        let { filter, page, limit } = req.query;

        page = page || 1;
        limit = limit || 6;
        let offset = limit * (page - 1);

        const params = {
            filter,
            limit,
            offset
        }

        const recipes = await Recipe.paginate(params);

        for(recipe of recipes) {
            recipe.file_path = `${req.protocol}://${req.headers.host}${recipe.file_path.replace('public', '')}`;
        }

        const pagination = {
            total: recipes[0] ? Math.ceil(recipes[0].total / limit) : 0,
            page,
            filter
        }

        return res.render('site/recipes', { recipes, pagination });
    },
    async trending(req, res){
        const recipes = await Recipe.trending();

        for(recipe of recipes) {
            recipe.file_path = `${req.protocol}://${req.headers.host}${recipe.file_path.replace('public', '')}`;
        }

        return res.render('site/index', { recipes });

    },
    async chefs(req, res){

        const chefs = await Chef.all();

        for(chef of chefs) {
            chef.file_src = `${req.protocol}://${req.headers.host}${chef.file_path.replace('public', '')}`;
        }
        
        return res.render('site/chefs', { chefs });

    },
    about(req, res){

        return res.render('site/about');

    },
    async show(req, res) {
        
        const { id } = req.params;

        const recipe = await Recipe.find(id);

        const files = await Recipe.files(id);

        for(file of files) {
            file.src = `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`;
        }

        if(!recipe){
            return res.send('Recipe not found');
        }
        
        return res.render('site/show', { recipe, files });
        
    }
}