module.exports = {
    isLogged(req, res, next) {
        if(!req.session.userId && req.url.includes('/admin')) return res.redirect(`/login`);
        
        next();
    }
}