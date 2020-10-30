const User = require('../models/User');

const token = require('crypto');
const { hash } = require('bcryptjs');
const mailer = require('../../lib/mailer');

module.exports = {
    async index(req, res) {

        const user = await User.findOne({
            where: {
                id: req.session.userId
            }
        })
        
        const users = await User.all();
        
        return res.render('admin/users/index', { users, loggedUser: user });
    
    },
    async create(req, res) {

        return res.render('admin/users/create');

    },
    async post(req, res) {

        const password = token.randomBytes(10).toString("hex");

        const passwordHash = await hash(password, 8);

        const data = {
            ...req.body,
            password: passwordHash,
            is_admin: !!req.body.is_admin
        }

        await User.create(data);

        await mailer.sendMail({
            to: data.email,
            from: 'no-reply@foodfy.com.br',
            subject: 'Cadastro de usuário',
            html: `<h2>${data.name}, seja bem-vindo ao Foodfy!</h2>
            <br>
            <p>Aqui estão os dados do seu login:</p>
            <p>Email: ${data.email}</p>
            <p>Senha: ${password}</p>
            <br>
            <p>
                Para entrar no site, clique no link abaixo.
            </p>
            <p>
                <a href="http://localhost:5000/login" target="_blank">
                    Acessar o Foodfy
                </a>
            </p>
            `
        });

        req.flash('success', `Usuário cadastrado com sucesso. As informações de cadastro foram enviadas para ele via email.`);

        return res.redirect('/admin/users');

    },
    async edit(req, res) {

        const { id } = req.params;

        const filter = {
            where: {
                id
            }
        }

        const user = await User.findOne(filter);

        if(!user) {
            req.flash('error', 'O usuário não foi encontrado, ele pode ter sido removido do sistema.')
            return res.redirect('/admin/users');
        }

        if(user.id == req.session.userId) return res.render('admin/user_area/edit', { user });
        else return res.render('admin/users/edit', { user });

    },
    async put(req, res) {
        
        const fields = {
            name: req.body.name,
            email: req.body.email,
            is_admin: !!req.body.is_admin
        }

        await User.update(fields, req.body.id);

        req.flash('success', 'O usuário foi atualizado com sucesso.');

        return res.redirect('/admin/users');

    },
    async delete(req, res) {

        await User.delete(req.body.id);

        req.flash('success', 'O usuário foi deletado');

        return res.redirect('/admin/users');

    }
}