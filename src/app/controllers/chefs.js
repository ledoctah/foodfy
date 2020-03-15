const Chef = require('../models/Chef');

module.exports = {
    index(req, res) {
        
        Chef.all(function(chefs) {
            return res.render('admin/chefs/index', { chefs });
        })
    
    },
    create(req, res) {

        return res.render('admin/chefs/create');
        
    },
    post(req, res) {
        
        const keys = Object.keys(req.body);
    
        for(key of keys) {
            if(req.body[key] == '') return res.send('Please, fill all fields');
        }
    
        Chef.create(req.body, function(id) {

            return res.redirect(`/admin/chefs/${id}`);

        });

    },
    show(req, res) {
        
        const { id } = req.params;

        Chef.find(id, function(chef) {

            Chef.findRecipesByChefId(id, function(recipes){

                return res.render('admin/chefs/show', { chef, recipes });

            });
        });

    },
    //need refactoration
    edit(req, res) {

        const { id } = req.params;

        Chef.find(id, function(chef) {

            if(!chef) return res.send('Chef not found');

            return res.render('admin/chefs/edit', { chef });

        });

    },
    put(req, res) {
        
        const keys = Object.keys(req.body);
    
        for(key of keys) {
            if(key != 'information' && req.body[key] == '') return res.send('Please, fill all fields');
        }

        Chef.update(req.body, function() {

            return res.redirect(`/admin/chefs/${req.body.id}`);

        });

    },
    delete(req, res) {
        
        const { id } = req.body;

        Chef.findRecipesByChefId(id, function(recipes) {

            if(!recipes.length){
                Chef.delete(id, function() {
                
                    return res.redirect(`/admin/chefs`);
    
                });
            } else {
                return res.send('Cannot delete chefs with recipes registered.');
            }

        })

    },
}
