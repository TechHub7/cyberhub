// const DB = "INSERT INTO `users` (`id`, `username`, `email`, `password`, `create_At`, `role`) VALUES (NULL, 'Apst. Abel', 'abel@gmail.com', MD5('123456'), current_timestamp(), 'User')";
// const sql = require("mysql2/promise")
const sql = require("postgres")
require('dotenv').config()
const MYSQL = sql.createConnection({
    host: process.env.platform == "DEVELOPMENT" ? process.env.HOST : process.env.POST_HOST,
    user: process.env.platform == "DEVELOPMENT" ? process.env.USER : process.env.POST_USER,
    password: process.env.platform == "DEVELOPMENT" ? process.env.PASS : process.env.POST_PASS,
    database: process.env.platform == "DEVELOPMENT" ? process.env.DATABASE : process.env.POST_DATABASE,
})

// console.log(process.env.PWD);

// MYSQL.connect((error) => {
//     console.log(error);
// })

module.exports = MYSQL