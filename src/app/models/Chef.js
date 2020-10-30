const db = require('../../config/db');

module.exports = {
    all() {
        return db.query(`SELECT chefs.*, (SELECT COUNT(*) FROM recipes WHERE chef_id = chefs.id) AS total_recipes, path AS file_path FROM chefs 
        LEFT JOIN files ON files.id = chefs.file_id ORDER BY created_at DESC`);
    },
    create(data) {
        
        const query = `INSERT INTO chefs(name, file_id) VALUES ($1, $2) RETURNING id`;

        const values = [
            data.name,
            data.file_id
        ];

        return db.query(query, values);

    },
    find(id) {

        const query = `SELECT chefs.*, (SELECT COUNT(*) FROM recipes WHERE chef_id = $1) AS total_recipes FROM chefs
        WHERE id = $1`;

        return db.query(query, [id]);
    },
    update(data) {

        const query = `UPDATE chefs SET name = $1, file_id = $2 WHERE id = $3`;

        const values = [
            data.name,
            data.file_id,
            data.id
        ];

        return db.query(query, values);

    },
    delete(id) {

        return db.query('DELETE FROM chefs WHERE id = $1', [id]);

    },
    findRecipesByChefId(id) {

        const query = `SELECT recipes.*, MIN(files.path) AS path FROM recipes
            INNER JOIN recipe_files ON recipe_files.recipe_id = recipes.id
            INNER JOIN files ON recipe_files.file_id = files.id
            WHERE chef_id = $1
            GROUP BY recipes.id`;

        return db.query(query, [id]);

    },
    files(id) {
        const query = `SELECT * FROM files WHERE id = $1`;

        return db.query(query, [id]);
    }
};