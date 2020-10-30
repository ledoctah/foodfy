const User = require('../models/User');
const Chef = require('../models/Chef');
const Recipe = require('../models/Recipe');

module.exports = {
    async canChange(req, res, next) {
        const user = await User.findOne({
            where: {
                id: req.session.userId
            }
        });

        const recipe = await Recipe.find(req.params.id || req.body.id);

        if(!user.is_admin && user.id != recipe.user_id) {
            req.flash('error', 'Somente um administrador ou o criador da receita podem fazer alterações');
            return res.redirect(`/admin/recipes/${recipe.id}`);
        }

        next();
    },
    async post(req, res, next) {
        const keys = Object.keys(req.body);

        const chefs = await Chef.all();

        for(key of keys) {
            if((key != 'information' && key != 'removed_files') && req.body[key] == '') return res.render('admin/recipes/create', {
                recipe: req.body,
                chefs,
                messages: {
                    error: 'Por favor, preencha todos os campos'
                }
            })
        }

        if(req.files.length == 0) return res.render('admin/recipes/create', {
            recipe: req.body,
            chefs,
            messages: {
                error: 'Por favor, envie pelo menos uma imagem da receita'
            }
        })

        next();
    },
    async put(req, res, next) {
        const keys = Object.keys(req.body);

        const chefs = await Chef.all();

        const files = await Recipe.files(req.body.id);

        for(file of files) {
            file.src = `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`;
        }

        for(key of keys) {
            if((key != 'information' && key != 'removed_files') && req.body[key] == '') return res.render('admin/recipes/edit', {
                recipe: req.body,
                files,
                chefs,
                messages: {
                    error: 'Por favor, preencha todos os campos'
                }
            })
        }

        next();
    }
}