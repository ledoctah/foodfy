const Chef = require('../models/Chef');
const File = require('../models/File');
const User = require('../models/User');

module.exports = {
    async index(req, res) {
        const chefs = await Chef.all();

        for(let chef of chefs) {
            chef .file_src = `${req.protocol}://${req.headers.host}${chef.file_path.replace('public', '')}`;
        }

        const loggedUser = await User.findOne({
            where: {
                id: req.session.userId
            }
        });

        return res.render('admin/chefs/index', { chefs, loggedUser });
    },
    create(req, res) {
        return res.render('admin/chefs/create');
    },
    async post(req, res) {
        
        const file = {
            ...req.files[0]
        }

        const file_id = await File.create(file);

        const data = {
            ...req.body,
            file_id
        }

        const chefId = await Chef.create(data);

        return res.redirect(`/admin/chefs/${chefId}`);

    },
    async show(req, res) {
        const { id } = req.params;

        const chef = await Chef.find(id);

        const file = await Chef.files(chef.file_id);

        file.src = `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`;
        
        const recipes = await Chef.findRecipesByChefId(chef.id);

        for(recipe of recipes) {
            recipe.src = `${req.protocol}://${req.headers.host}${recipe.path.replace('public', '')}`;
        }

        const loggedUser = await User.findOne({
            where: {
                id: req.session.userId
            }
        });

        return res.render('admin/chefs/show', { chef, recipes, file, loggedUser });

    },
    async edit(req, res) {

        const { id } = req.params;

        const chef = await Chef.find(id);

        if(!chef) return res.send('Chef not found');

        const file = await Chef.files(chef.file_id);

        file.src = `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`;

        return res.render('admin/chefs/edit', { chef, file });

    },
    async put(req, res) {

        let fileId;

        if(req.files.length != 0) {
            const file = {
                ...req.files[0]
            }

            fileId = await File.create(file);
        }

        const chef = {
            ...req.body,
            file_id: fileId || req.body.file_id
        }

        await Chef.update(chef);

        if(req.body.removed_files) {
            const removedFile = req.body.removed_files.split(',')[0];
            
            await File.delete(removedFile);
        }

        return res.redirect(`/admin/chefs/${req.body.id}`);

    },
    async delete(req, res) {
        
        const { id } = req.body;

        const recipes = Chef.findRecipesByChefId(id);

        if(!recipes.length){
            const chef = await Chef.find(id);
            
            const file = await Chef.files(chef.file_id);

            await Chef.delete(id);
            
            await File.delete(file.id);

            return res.redirect(`/admin/chefs`);
        } else {
            return res.send('Cannot delete chefs with recipes registered.');
        }

    },
}
