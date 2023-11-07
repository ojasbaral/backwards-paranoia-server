const Pool = require('pg').Pool

const pool = new Pool({
    host: 'db', // the database server
    port: 5432, // the database port
    database: process.env.POSTGRES_DB, // the database name
    user: process.env.POSTGRES_USER, // the user account to connect with
    password: process.env.POSTGRES_PASSWORD, // the password of the user account
})

pool.connect((err) => {
    if (err){
        throw err
    } else{
    console.log("[DB CONNECTED]")
    }
})

module.exports = pool