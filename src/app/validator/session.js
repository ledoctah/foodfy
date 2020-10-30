const User = require('../models/User');
const { compare } = require('bcryptjs');

module.exports = {
    async login(req, res, next) {
        const { email, password } = req.body;
        
        if(!password) return res.render('session/login', {
            user: req.body,
            messages: {
                error: 'Por favor, forneça a senha para efetuar o login'
            }
        });

        const user = await User.findOne({
            where: {
                email
            }
        });

        if(!user) return res.render('session/login', {
            user: req.body,
            messages: { 
                error: 'O usuário não está cadastrado'
            }
        });

        const isPasswordCorrect = await compare(password, user.password);

        if(!isPasswordCorrect) return res.render('session/login', {
            user: req.body,
            messages: { 
                error: 'A senha está incorreta'
            }
        })

        req.user = user;

        next();
    },
    redirectLoggedUser(req, res, next) {
        if(req.session.userId){
            req.flash('warning', `Você já está logado`);
            return res.redirect('/admin');
        } 

        next();
    },
    async forgot(req, res, next) {
        const  { email } = req.body;
    
        try{
            let user = await User.findOne({ where: {email} });
    
            if(!user) return res.render('session/forgot-password', {
                user: req.body,
                error: 'Email não cadastrado'
            });
    
            req.user = user;
            
            next();
        }catch(err) {
            console.error(err);
        }
    }
}