require('./public/js/utils.js');
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const User = require('./models/user.js');
const crypto = require("crypto");


const app = express();
const port = process.env.PORT || 3000;
const node_session_secret = process.env.NODE_SESSION_SECRET;

const {database} = include('databaseConnection');
app.use(express.urlencoded({extended: false})); 

app.set('view engine', 'ejs');

app.use(session({
    secret: node_session_secret,
    store: database.store,
    saveUninitialized: false,
    resave: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.get('/', (req, res) => {
    if (req.session.authenticated) {
        var username = req.session.username;
        res.send(`<h2>Hello, ${username}.</h2>
        <a href='/members'><button>Members</button></a>
        <a href='/logout'><button>Logout</button></a>`);
    } else {
        res.render('landing');
    }
}); 

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/submitUser', async (req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    const schema = Joi.string().max(20).required();
    const validationResult = schema.validate(username);
    if (validationResult.error != null) {
        console.log(validationResult.error);
        res.redirect('/login');
    }

    const user = await User.findOne({username: username});

    if (!user) {
        console.log("User not found.");
        res.redirect('/login');
        return;
    }

    if (await bcrypt.compare(password, user.password)) {
        console.log("correct password");
        req.session.authenticated = true;
        req.session.username = username;
        res.redirect('/');
        return;
    } else {
        res.send(`Incorrect Login
        <a href='/login'>Try again</a>
        `);
        return;
    }
});

app.get("/signup", (req, res) => {
    res.render('signup');
});

app.post('/createUser', async (req, res) => {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;

    const schema = Joi.object({
        username: Joi.string().alphanum().max(20).required(),
        email: Joi.string().email(),
        password: Joi.string().max(20).required()
    });

    const validationResult = schema.validate({username, email, password});
    if (validationResult.error != null) {
        console.log(validationResult.error);
        res.redirect('/signup');
    }

    var hashedPassword = await bcrypt.hash(password, 12);
    
    try {
        var newUser = new User({
            username: username,
            email: email,
            password: hashedPassword
        });
        await newUser.save();
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal server error');
    }
    console.log("Inserted User");

    res.send(`Created User</br>
    <a href='/login'><button>Login</button></a>
    `);
});

app.get('/logout', (req,res) => {
    req.session.destroy();
    res.redirect("/");
});



app.get('*', (req, res) => {
    res.render('404');
})

app.use(express.static(__dirname + '/public'));

app.listen(port, () => {
    console.log(`server started listening on port ${port}`);
})