require('./public/js/utils.js');
require('dotenv').config();
require("express-async-errors");

const bcrypt = require('bcrypt');
const User = require('./models/user.js');
const Joi = require('joi');
const express = require('express');
const session = require('express-session');
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;
const node_session_secret = process.env.NODE_SESSION_SECRET;

const connection = include('databaseConnection');
const database = connection.database;
const store = connection.store;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false})); 

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

app.use(session({
    secret: node_session_secret,
    store: store,
    saveUninitialized: false,
    resave: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.set('view engine', 'ejs');

// ------ Use modular routes ------
app.use(require('./routes/authRoutes'));
app.use(require('./routes/resetRoutes'));
// --------------------------------

app.get('/', (req, res) => {
    if (req.session.authenticated) {
        var username = req.session.username;
        res.render("index", {username: username});
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
        res.render("invalidLogin");
        return;
    }
});

app.get("/signup", (req, res) => {
    res.render('signup');
});

// app.post('/createUser', async (req, res) => {
//     var username = req.body.username;
//     var email = req.body.email;
//     var password = req.body.password;
//     var address =  req.body.address;
//     var city = req.body.city;
//     var province = req.body.province;
//     var postal = req.body.postal;

//     const schema = Joi.object({
//         username: Joi.string().alphanum().max(20).required(),
//         email: Joi.string().email(),
//         password: Joi.string().max(20).required(),
//         address: Joi.string().required(),
//         city: Joi.string().max(20).required(),
//         province: Joi.string().max(20).required(),
//         postal: Joi.string().max(20).required(),
//     });

//     const validationResult = schema.validate({username, email, password, address, city, province, postal});
//     if (validationResult.error != null) {
//         console.log(validationResult.error);
//         res.redirect('/signup');
//         return;
//     }

//     var hashedPassword = await bcrypt.hash(password, 12);
    
//     try {
//         var newUser = new User({
//             username: username,
//             email: email,
//             password: hashedPassword,
//             address: address,
//             city: city,
//             province: province,
//             postal: postal,
//         });
//         await newUser.save();
//     } catch (e) {
//         console.error(e);
//         res.status(500).send('Internal server error');
//         return;
//     }
//     console.log("Inserted User");

//     res.send(`Created User</br>
//     <a href='/login'><button>Login</button></a>
//     `);
// });

app.get('/profile', async (req, res) => {
    if (req.session.authenticated) {
        console.log("in profile");
        const result = await User.findOne({ username: req.session.username });
        console.log(result);

        if (!result) {
            res.send("User not found");
            return;
        }

        res.render("profile", {user: result});
    } else {
        res.render("landing");
    }
});

app.post('/update/:email', async (req, res) => {
    var email = req.params.email;

    const schema = Joi.object({
        email: Joi.string().email(),
    });

    const validationResult = schema.validate({ email });
    if (validationResult.error != null) {
        console.log(validationResult.error);
        res.redirect('/login');
        return;
    }

    await User.updateOne({ email: email }, 
        { $set: { 
            address: req.body.address,
            city: req.body.city,
            province: req.body.province,
            postal: req.body.postal
        }});

    res.redirect('/profile');
});

app.get('/logout', (req,res) => {
    req.session.destroy();
    res.redirect("/");
});

app.get('*', (req, res) => {
    res.status(404);
    res.render('404');
})

app.listen(port, () => {
    console.log(`server started listening on port ${port}`);
});