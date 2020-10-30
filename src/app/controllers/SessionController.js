const mailer = require('../../lib/mailer');
const crypto = require('crypto');
const { hash } = require('bcryptjs');

const User = require('../models/User');

module.exports = {
    loginForm(req, res) {
        return res.render('session/login');
    },
    login(req, res) {
        req.session.userId = req.user.id;

        return res.redirect(`/admin/users/${req.user.id}/edit`);
    },
    logout(req, res) {
        req.session.destroy();
        
        return res.redirect('/');
    },
    forgotForm(req, res) {
        return res.render('session/forgot-password');
    },
    async forgot(req, res) {
        const user = req.user;

        try{

            const token = crypto.randomBytes(20).toString("hex");
    
            let now = new Date();
            now = now.setHours(now.getHours + 1);
    
            await User.update({
                reset_token: token,
                reset_token_expires: now
            }, user.id);

            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@launchstore.com.br',
                subject: 'Recuperação de senha',
                html: `<h2>Perdeu a chave?</h2>
                <p>Não se preocupe, clique no link abaixo para recuperar sua senha</p>
                <p>
                    <a href="http://localhost:3000/password-reset?token=${token}" target="_blank">
                        Recuperar senha
                    </a>
                </p>
                `
            });
    
            // avisar que email foi enviado
            return res.render('session/forgot-password', {
                success: 'Verifique seu email para resetar sua senha'
            });

        } catch(err) {
            console.error(err);
            return res.render('session/forgot-password', {
                error: 'Erro inesperado, tente novamente!'
            })
        }
    },
    resetForm(req, res) {
        return res.render('session/password-reset');
    },
    async reset(req, res) {
        const user = req.user;
        const { password, token } = req.body;

        try{
            
            //cria um novo hash de senha
            const newPassword = await hash(password, 8);
            
            //atualiza o usuário
            await User.update({
                password: newPassword,
                reset_token: '',
                reset_token_expires: ''
            }, user.id);

            //avisa o usuário que ele tem uma nova senha
            return res.render('session/login', {
                user: req.body,
                success: 'Senha atualizada! Faça o seu login'
            })

        }catch(err){
            console.error(err);
            return res.render('session/password-reset', {
                user: req.body,
                token,
                error: 'Erro inesperado, tente novamente!'
            });
        }
    }
}