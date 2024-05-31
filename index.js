require('./public/js/utils.js');
require('dotenv').config();
require("express-async-errors");

const express = require('express');
const session = require('express-session');
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;
const node_session_secret = process.env.NODE_SESSION_SECRET;

const connection = include('databaseConnection');
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
        maxAge: 1000 * 60 * 60 * 1
    }
}));

app.set('view engine', 'ejs');

// ------ Use modular routes ------
app.use(require('./routes/authRoutes'));
app.use(require('./routes/resetRoutes'));
app.use(require('./routes/orderRoutes'));
app.use(require('./routes/checkoutRoutes.js'));
app.use(require('./routes/profileRoutes.js'));
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

app.get('*', (req, res) => {
    res.status(404);
    res.render('404');
});

app.listen(port, () => {
    console.log(`server started listening on port ${port}`);
});