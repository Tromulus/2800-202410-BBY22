require('./public/js/utils.js');
require('dotenv').config();
require("express-async-errors");

const bcrypt = require('bcrypt');
const Joi = require('joi');
const express = require('express');
const session = require('express-session');
const cors = require("cors");
const User = require('./models/user.js');
const Robot = require('./models/robot.js');
const Cart = require('./models/cart.js');

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
        maxAge: 1000 * 60 * 60 * 2
    }
}));

app.set('view engine', 'ejs');

// ------ Use modular routes ------
app.use(require('./routes/authRoutes'));
app.use(require('./routes/resetRoutes'));
app.use(require('./routes/orderRoutes'));
app.use(require('./routes/checkoutRoutes.js'));
// --------------------------------

app.get('/', (req, res) => {
    if (req.session.authenticated) {
        var username = req.session.username;
        res.render("robots", {username: username});
    } else {
        res.render('landing');
    }
}); 

app.get("/surprise", (req, res) => {
    res.render("rotateRobot");
});

app.get('/profile', async (req, res) => {
    if (req.session.authenticated) {
        // console.log("in profile");
        const result = await User.findOne({ username: req.session.username });
        // console.log(result);

        if (!result) {
            res.send("User not found");
            return;
        }

        res.render("profile", {user: result});
    } else {
        res.render("login");
    }
});

app.post('/update/:email', async (req, res) => {
    var email = req.params.email;
    var address = req.body.address;
    var city = req.body.city;
    var province = req.body.province;
    var postal = req.body.postal;

    const schema = Joi.object({
        email: Joi.string()
        .email({tlds: {allow: false}})
        .required()
        .messages({
            'string.base': 'Email must be a string',
            'string.empty': 'Email is required',
            'string.email': 'Email must be a valid email',
            'string.domain': 'Email must be a valid email'
        }),
        address: Joi.string().trim().required().messages({
            'any.required': 'Address is required.',
            'string.empty': 'Address cannot be empty.'
        }),
        city: Joi.string().trim().required().messages({
            'any.required': 'City is required.',
            'string.empty': 'City cannot be empty.'
        }),
        province: Joi.string().trim().required().messages({
            'any.required': 'Province is required.',
            'string.empty': 'Province cannot be empty.'
        }),
        postal: Joi.string().trim().regex(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/)
            .required().messages({
                'any.required': 'Postal code is required.',
                'string.empty': 'Postal code cannot be empty.',
                'string.pattern.base': 'Postal code must be a valid Canadian postal code.'
            })
    });

    const validationResult = schema.validate({ email, address, city, province, postal }, { abortEarly: false });
    if (validationResult.error != null) {
    let errorMessages = validationResult.error.details.map(detail => detail.message);
    res.redirect('/profile?errors=' + encodeURIComponent(JSON.stringify(errorMessages)));
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

app.get('*', (req, res) => {
    res.status(404);
    res.render('404');
});

app.listen(port, () => {
    console.log(`server started listening on port ${port}`);
});