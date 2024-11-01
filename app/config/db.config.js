// const DB = "INSERT INTO `users` (`id`, `username`, `email`, `password`, `create_At`, `role`) VALUES (NULL, 'Apst. Abel', 'abel@gmail.com', MD5('123456'), current_timestamp(), 'User')";
// const sql = require("mysql2/promise")
const sql = require("mysql2")
require('dotenv').config()
const MYSQL = sql.createConnection({
    host: process.env.HOST || "localhost",
    user: process.env.USER || "root",
    password: process.env.PASS || "",
    database: process.env.DATABASE || "cyberhub",
})

// console.log(process.env.PWD);

// MYSQL.connect((error) => {
//     console.log(error);
// })

module.exports = MYSQL