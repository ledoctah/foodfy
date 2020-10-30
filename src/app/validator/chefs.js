const User = require('../models/User');

function isImageUploaded(files) {
    return files.length != 0;
}

module.exports = {
    async adminOnly(req, res, next) {

        const user = await User.findOne({
            where: {
                id: req.session.userId
            }
        });

        if(!user.is_admin) {
            req.flash('error', 'Somente administradores podem ter acesso a esse recurso do sistema');
            if(req.params.id) return res.redirect(`/admin/chefs/${req.params.id}`);
            else return res.redirect('/admin/chefs');
        }

        next();
    },
    async post(req, res, next) {

        const keys = Object.keys(req.body);

        for(key of keys) {
            if(req.body[key] == '') {
                return res.render('admin/chefs/create', { 
                    chef: req.body,
                    messages: {
                        error: 'Por favor, preencha todos os campos'
                    }
                });
            }
        }

        if(!isImageUploaded(req.files)) return res.render('admin/chefs/create', {
            chef: req.body,
            messages: {
                error: 'Por favor, selecione o avatar do Chef'
            }
        })

        const user = await User.findOne({
            where: {
                id: req.session.userId
            }
        });

        if(!user.is_admin) {
            req.flash('error', 'Somente administradores podem ter acesso a esse recurso do sistema');
            return res.redirect('/admin/chefs');
        }

        next();
    },
    async put(req, res, next) {

        const keys = Object.keys(req.body);
    
        for(key of keys) {
            if(req.body[key] == '' && key != 'removed_files'){
                req.flash('error', 'Por favor, preencha todos os campos');
                return res.redirect(`/admin/chefs/${req.body.id}/edit`);
            } 
        }

        next();
    }
}