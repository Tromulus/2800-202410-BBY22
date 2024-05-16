require('./public/js/utils.js');
require('dotenv').config();
require("express-async-errors");

const express = require('express');
const session = require('express-session');
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;
const node_session_secret = process.env.NODE_SESSION_SECRET;

const {database} = include('databaseConnection');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false})); 

app.use(session({
    secret: node_session_secret,
    store: database.store,
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
    res.render('landing', {username: req.session.username});
}); 

app.use((error, req, res, next) => {
    res.status(500).json({ error: error.message });
});

app.use(express.static(__dirname + '/public'));

app.get('*', (req, res) => {
    res.render('404');
})

app.listen(port, () => {
    console.log(`server started listening on port ${port}`);
});