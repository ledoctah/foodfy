const db = require('../../config/db');

module.exports = {
    async all() {
        const results = await db.query('SELECT * FROM users');

        return results.rows;
    },
    async create({name, email, is_admin, password}) {
        const query = `INSERT INTO users(name, email, is_admin, password) VALUES ($1, $2, $3, $4) RETURNING id`;

        const results = await db.query(query, [name, email, is_admin, password]);

        return results.rows[0].id;
    },
    async findOne(filters) {
        let query = `SELECT * FROM users`;

        Object.keys(filters).map(key => {
            query = `${query}
            ${key}`;

            Object.keys(filters[key]).map(field => {
                query = `${query} ${field} = '${filters[key][field]}'`;
            });
        });
        
        const results = await db.query(query);

        return results.rows[0];
    },
    update(fields, id){
        let query = "UPDATE users SET";

        Object.keys(fields).map((key, index, array) => {

            if((index+1) < array.length){
                query = `${query}
                    ${key} = '${fields[key]}',
                `
            } else {
                //last iteration
                query = `${query}
                    ${key} = '${fields[key]}'
                    WHERE id = ${id}
                `
            }
            
        });

        return db.query(query);
    },
    delete(id) {
        const query = `DELETE FROM users WHERE id = ${id}`;

        return db.query(query);
    }
}