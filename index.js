const express = require('express')
const app = express()
const PATH = require('path')
require('dotenv').config()
const PORT = process.env.PORT || 5000
const bodyParser = require('body-parser')
const MD5 = require('md5')
const CORS = require('cors')

// cross origin
app.use(CORS())

const corsOptions = {
    origin: "*", // 'http://localhost:5500'
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(CORS(corsOptions))

// import DB
const MYSQL = require("./app/config/db.config")
const { METHODS } = require('http')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// app.use("/firstNetflixSite", express.static(PATH.join(__dirname, 'firstNetflixSite')))
app.use(express.static(PATH.join(__dirname, 'firstNetflixSite')))

app.get('/', (req, res) => {
    res.send('Welcome')
})

// Handle user login
app.get('/login', (req, res) => {
    res.sendFile(PATH.join(__dirname, "firstNetflixSite", "/signIn.html"))
})

// handle form submit
app.post('/login', (req, res) => {
    // res.sendFile(PATH.join(__dirname, "firstNetflixSite", "/signIn.html"))
    // console.log(req.body);
    const email = req.body.email
    const pwd = req.body.pwd

    // Query the Database (DB)
    if(email != '' && pwd != ''){ // validation user data
        // check if user exist in the DB
        
       MYSQL.query("SELECT * FROM users WHERE email=? LIMIT 1", [email], (err, result) => {
        if(err) throw err; //throw means console log
        if(result.length > 0){
            // console.log(result);
            const { id, email, password } = result[0]

            // console.log(email, password);
             const hashed_pwd = MD5(pwd)

            //  console.log(hashed_pwd);
            if(hashed_pwd === password){
                // res.json({ msg: 'Successful', payload: result[0] })
                // res.redirect("/dashboard")
                res.status(200).json({ msg: 'Successful', payload: result[0] })
            }else{
                res.json({ msg: "Invalid Credentials." })
            }
            
        }else{
            console.log("No user found");
            res.json({ msg: 'No User Found' })
        }
    })
        // match the password
        // create session
        // console.log(email, pwd);
        
    }else{
        res.json({ msg: 'Unsuccessful' })
    }
})

app.get("/dashboard", (req, res) => {
    res.sendFile(PATH.join(__dirname, "firstNetflixSite", "/welcome.html"))
})

// sign up route
app.post("/signup", (req, res) => {
    // console.log(req.body);

    const email = req.body.email
    const username = req.body.username
    const pwd = req.body.pwd

    if(email && username && pwd){
        console.log(email, username, pwd);
        // insert into DB
        MYSQL.query("INSERT INTO users(id, username, email, password, create_At, role) VALUES (?,?,?,?,?,?)", [null,username,email,MD5(pwd),"" ,"user"], (err,result) => {
            if(err) throw err
            if(result){
                // console.log(result);
                if(result.affectedRows > 0){
                    res.json({ msg: "Registration Success" })
                }else{
                    res.json({ msg: "Registration Failed" })
                }
            }
        })
    }else{
        res.status(300).json({ msg: "Please fill out the form" })
    }
})

// change password
app.post("/resetpassword", (req, res) => {
    // console.log(req.body);
    const email = req.body.email
    const pwd = req.body.pwd
    const new_pwd = req.body.new_pwd
    const c_new_pwd = req.body.c_new_pwd

    // check if email exist in DB
    // console.log(email);
    
    MYSQL.query("SELECT * FROM users WHERE email=? LIMIT 1", [email], (err, result) => {
        if(err) throw err;
        if(result){
            // check is old password match
            const password = result[0].password
            if(password === MD5(pwd)){
                // update the new password
                MYSQL.query("UPDATE users SET password=? WHERE email=? LIMIT 1", [MD5(new_pwd), email], (err, result) => {
                    if(err) throw err;
                    if(result){
                        res.status(200).json({ msg: "Password Updated" })
                    }else{
                        res.status(300).json({ msg: "Password Reset Failed" })
                        
                    }
                }) 
            }else{
                res.status(300).json({ msg: "Wrong Credentials. try again" })
            }
        }else{
            res.status(300).json({ msg: "Email not found!, create an account" })
            
        }
    })
    
})

// connect or make blog post
app.get("/posts", (req, res) => {
    try{
        MYSQL.query("SELECT * FROM posts", (err, values) => {
            if(err) throw err;
            if(values){
                res.json({ msg: "Post has been fetched", payload: values })
            }
        })
    }catch(error){
        console.log(error);
        
    }
})

app.listen(PORT, () => console.log(`APP RUNNING ON ${PORT}`));