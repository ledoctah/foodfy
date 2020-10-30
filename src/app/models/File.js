const db = require('../../config/db');
const fs = require('fs');

module.exports = {
    async create({filename, path}) {
        const query = `INSERT INTO files (name, path) VALUES ($1, $2) RETURNING id`;

        const results = await db.query(query, [filename, path]);

        return results.rows[0].id;
    },
    async delete(id) {

        try{
            const results = await db.query('SELECT * FROM files WHERE id = $1', [id]);
            const file = results.rows[0];

            fs.unlinkSync(file.path);

            return db.query(`DELETE FROM files WHERE id = $1`, [id]);
        } catch(err) {
            console.log(err);
        }
        
    }
}