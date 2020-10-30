const { Pool } = require('pg');

module.exports = new Pool({
    user: process.env.DB_username,
    password: process.env.DB_password,
    host: process.env.DB_hostname,
    port: 5432,
    database: 'foodfy'
})