const db = require('../../config/db');

module.exports = {
    all() {

        const query = `SELECT recipes.*, chefs.name AS chef_name FROM recipes
        INNER JOIN chefs ON recipes.chef_id = chefs.id`

        return db.query(query); 

    },
    findBy(filter) {
        
        filter = filter || '';

        const query = `SELECT *, (SELECT name FROM chefs WHERE chefs.id = recipes.chef_id) as chef_name FROM recipes WHERE title ILIKE '%${filter}%'
        ORDER BY updated_at DESC`;

        return db.query(query);

    },
    async trending() {
        
        const results = await db.query(`SELECT recipes.*, chefs.name AS chef_name, (SELECT path FROM files INNER JOIN recipe_files ON recipe_files.file_id = files.id 
            WHERE recipe_id = recipes.id LIMIT 1) AS file_path FROM recipes INNER JOIN chefs ON recipes.chef_id = chefs.id 
            LIMIT 6`);

        return results.rows;

    },
    async create(data) {
        const query = `INSERT INTO recipes (chef_id, title, ingredients, preparation, information, user_id) VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING id`;

        const values = [
            data.chef_id,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.user_id
        ];

        const results = await db.query(query, values);

        return results.rows[0].id;
    },
    async find(id) {

        const query = `SELECT recipes.*, chefs.name AS chef_name FROM recipes
        INNER JOIN chefs ON chefs.id = recipes.chef_id
        WHERE recipes.id = $1`

        const results = await db.query(query, [id]);

        return results.rows[0];
    },
    async files(id) {
        const query = `SELECT files.* FROM files 
        INNER JOIN recipe_files ON recipe_files.file_id = files.id
        WHERE recipe_id = $1`;

        const results = await db.query(query, [id]);

        return results.rows;
    },
    update(data) {

        const query = `UPDATE recipes SET chef_id = $1, title = $2, ingredients = $3, preparation = $4, information = $5
        WHERE id = $6`;

        const values = [
            data.chef_id,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.id
        ];

        return db.query(query, values);

    },
    delete(id) {

        return db.query('DELETE FROM recipes WHERE id = $1', [id]);

    },
    async paginate(params) {
        
        const { filter, limit, offset } = params;

        let query = "",
            filterQuery = "",
            totalQuery = "(SELECT COUNT(*) FROM recipes) AS total";

        if(filter) {
            filterQuery = `WHERE title ILIKE '%${filter}%'`;

            totalQuery = `(SELECT COUNT(*) FROM recipes ${filterQuery}) AS total`;
        }

        const fileQuery = '(SELECT path FROM files INNER JOIN recipe_files ON recipe_files.file_id = files.id WHERE recipe_id = recipes.id LIMIT 1) AS file_path'

        query = `SELECT recipes.*, ${totalQuery}, chefs.name AS chef_name, ${fileQuery} FROM recipes
        INNER JOIN chefs ON chefs.id = recipes.chef_id
        ${filterQuery}
        ORDER BY updated_at DESC
        LIMIT ${limit} OFFSET ${offset}`;

        const results = await db.query(query);

        return results.rows;

    },
    async chefsSelectOptions() {
        const results = await db.query(`SELECT id, name FROM chefs`);

        return results.rows;
    }
};