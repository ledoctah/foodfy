const db = require('../../config/db');

module.exports = {
    all(callback) {
        db.query(`SELECT *, (SELECT COUNT(*) FROM recipes WHERE chef_id = chefs.id) AS total_recipes FROM chefs ORDER BY created_at ASC`, null, function(err, results) {
            if(err) throw `Database error! ${err}`;

            callback(results.rows);
        });
    },
    create(data, callback) {
        
        const query = `INSERT INTO chefs(name, avatar_url) VALUES ($1, $2) RETURNING id`;

        const values = [
            data.name,
            data.avatar_url
        ];

        db.query(query, values, function(err, results) {
            if(err) throw `Database error ${err}`;

            callback(results.rows[0].id);
        });

    },
    find(id, callback) {

        const query = `SELECT chefs.*, (SELECT COUNT(*) FROM recipes WHERE chef_id = $1) AS total_recipes FROM chefs
        WHERE id = $1`;

        db.query(query, [id], function(err, results) {
            if(err) throw `Database error! ${err}`;

            callback(results.rows[0]);
        });
    },
    update(data, callback) {

        const query = `UPDATE chefs SET name = $1, avatar_url = $2 WHERE id = $3`;

        const values = [
            data.name,
            data.avatar_url,
            data.id
        ];

        db.query(query, values, function(err, results) {
            if(err) `Database error! ${err}`;

            callback();
        });

    },
    delete(id, callback) {

        db.query('DELETE FROM chefs WHERE id = $1', [id], function(err, results) {
            if(err) `Database error! ${err}`;

            callback();
        });

    },
    findRecipesByChefId(id, callback) {

        const query = `SELECT * FROM recipes WHERE chef_id = $1`;

        db.query(query, [id], function(err, results) {
            if(err) throw `Database error! ${err}`;

            callback(results.rows);
        });

    }
};