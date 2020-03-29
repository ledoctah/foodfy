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

        const results = await Recipe.paginate(params);

        const recipes = results.rows.map(recipe => ({
            ...recipe,
            file_path: `${req.protocol}://${req.headers.host}${recipe.file_path.replace('public', '')}`
        }));

        const pagination = {
            total: recipes[0] ? Math.ceil(recipes[0].total / limit) : 0,
            page,
            filter
        }

        return res.render('site/recipes', { recipes, pagination });

        
    },
    async trending(req, res){
        
        const results = await Recipe.trending();

        const recipes = results.rows.map(recipe => ({
            ...recipe,
            file_path: `${req.protocol}://${req.headers.host}${recipe.file_path.replace('public', '')}`
        }));

        return res.render('site/index', { recipes });

    },
    async chefs(req, res){

        const results = await Chef.all();

        const chefs = results.rows.map(chef => ({
            ...chef,
            file_src: `${req.protocol}://${req.headers.host}${chef.file_path.replace('public', '')}`
        }));
        
        return res.render('site/chefs', { chefs });

    },
    about(req, res){

        return res.render('site/about');

    },
    async show(req, res) {
        
        const { id } = req.params;

        let results = await Recipe.find(id);

        const recipe = results.rows[0];

        results = await Recipe.files(id);

        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
        }));

        if(!recipe){
            return res.send('Recipe not found');
        }
        
        return res.render('site/show', { recipe, files });
        
    }
}