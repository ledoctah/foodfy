const { compare } = require('bcryptjs');

const User = require('../models/User');

function isFieldsFilled(data) {
    const keys = Object.keys(data);

    for(key of keys) {
        if(!data[key] && key != 'is_admin') return false;
    }

    return true;
}

function isPasswordCorrect(givenPassword, expectedPassword) {
    return compare(givenPassword, expectedPassword);
}

module.exports = {
    async adminOnly(req, res, next) {

        const user = await User.findOne({
            where: {
                id: req.session.userId
            }
        });

        if(!user.is_admin) {

            if((req.body.id != req.session.userId && req.params.id != req.session.userId) || req.method == 'DELETE') {
                req.flash('error', 'Somente administradores podem ter acesso a esse recurso do sistema');
                return res.redirect('/admin/users');
            }

        }

        next();

    },
    async post(req, res, next) {

        if(!isFieldsFilled(req.body)) return res.render('admin/users/create', { 
            user: req.body,
            messages: {
                error: 'Por favor, preencha todos os campos.'
            }
        });

        const filter = {
            where: {
                email: req.body.email
            }
        }
    
        const user = await User.findOne(filter);

        if(user) return res.render('admin/users/create', {
            user: req.body,
            messages: {
                error: 'O email já está cadastrado.'
            }
        });

        next();
    },
    async put(req, res, next) {
        if(!isFieldsFilled(req.body)){
            req.flash('error', 'Por favor, preencha todos os campos.');
            return res.redirect(`/admin/users/${req.body.id}/edit`);
        }

        const user = await User.findOne({
            where: {
                id: req.body.id,
            }
        });

        if(req.body.id == req.session.userId) {
            if(!user) {
                req.flash('error', 'Usuário não encontrado.');
                return res.redirect('/admin/users');
            }

            const passed = await isPasswordCorrect(req.body.password, user.password);

            if(!passed) {
                req.flash('error', 'Senha incorreta.');
                return res.redirect(`/admin/users/${req.body.id}/edit`);
            }
        }


        next();
    },
    async delete(req, res, next) {
        if(req.body.id == req.session.userId) {
            req.flash('error', 'Você não pode deletar o seu próprio usuário');
            return res.redirect('/admin/users');
        }

        next();
    }
}