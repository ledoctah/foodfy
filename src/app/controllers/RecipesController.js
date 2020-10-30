const Recipe = require('../models/Recipe');
const File = require('../models/File');
const RecipeFile = require('../models/RecipeFile');
const User = require('../models/User');

module.exports = {
    async index(req, res) {

        let { filter, page, limit } = req.query;

        page = page || 1;
        limit = limit || 6;
        let offset = limit * (page - 1);

        const params = {
            filter,
            limit,
            offset,
        }

        const recipes = await Recipe.paginate(params);

        const pagination = {
            total: recipes[0] ? Math.ceil(recipes[0].total / limit) : 0,
            page,
            filter
        }

        for(let recipe of recipes) {
            recipe.src = `${req.protocol}://${req.headers.host}${(recipe.file_path).replace('public', '')}`;
        }

        return res.render('admin/recipes/index', { recipes, pagination });

    
    },
    async create(req, res) {
        const chefs = await Recipe.chefsSelectOptions();
        
        return res.render('admin/recipes/create', { chefs });
        
    },
    async post(req, res) {
        const ingredients = [];
        const preparation = [];

        for(ingredient of req.body.ingredients) {
            if(ingredient != '') ingredients.push(ingredient);
        }

        for(step of req.body.preparation) {
            if(step != '') preparation.push(step);
        }

        const data = {
            ...req.body,
            ingredients,
            preparation,
            user_id: req.session.userId
        }

        const recipe_id = await Recipe.create(data);

        const filesPromise = req.files.map(async file => {
            const file_id = await File.create(file);

            await RecipeFile.create({
                file_id,
                recipe_id
            });
        });

        await Promise.all(filesPromise);

        return res.redirect(`/admin/recipes/${recipe_id}`);
    },
    async show(req, res) {

        const { id } = req.params;

        let recipe = await Recipe.find(id);

        if(!recipe) return res.send('Recipe not found');

        files = await Recipe.files(id);

        for(file of files) {
            file.src = `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`;
        }

        const loggedUser = await User.findOne({
            where: {
                id: req.session.userId
            }
        });

        return res.render('admin/recipes/show', { recipe, files, loggedUser });

    },
    async edit(req, res) {
        const { id } = req.params;

        const recipe = await Recipe.find(id);

        if(!recipe) return res.send('Recipe not found');

        const chefs = await Recipe.chefsSelectOptions();

        const files = await Recipe.files(id);

        for(file of files) {
            file.src = `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`;
        }

        return res.render('admin/recipes/edit', { recipe, chefs, files });
    },
    async put(req, res) {    
        const { id: recipe_id } = req.body

        if(req.files.length != 0) {
            const filesPromise = req.files.map(async file => {
                const file_id = await File.create(file);
                
                const recipeFile = {
                    file_id,
                    recipe_id
                }

                await RecipeFile.create(recipeFile);
            });

            await Promise.all(filesPromise);
        }

        if(req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(',');
            const lastIndex = removedFiles.length-1;
            removedFiles.splice(lastIndex, 1);

            const removedFilesPromise = removedFiles.map(async id => {
                await RecipeFile.delete({
                    file_id: id,
                    recipe_id,
                });

                await File.delete(id);
            });

            await Promise.all(removedFilesPromise);
        }

        await Recipe.update(req.body);

        return res.redirect(`/admin/recipes/${req.body.id}`);

    },
    async delete(req, res) {
        
        const { id } = req.body;

        const files = await Recipe.files(id);

        const filesPromise = files.map(async file => {
            const files = {
                file_id: file.id,
                recipe_id: id
            }

            await RecipeFile.delete(files);

            await File.delete(file.id);
        });

        Promise.all(filesPromise);

        await Recipe.delete(id);
        
        return res.redirect(`/admin/recipes`);
    }
}
