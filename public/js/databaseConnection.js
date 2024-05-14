require('dotenv').config();
const session = require('express-session');
const mongoose = require('mongoose');
const MongoDBSession = require('connect-mongodb-session')(session);
const mongodb_host = process.env.MONGODB_HOST;
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_database = process.env.MONGODB_DATABASE;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;
const atlasURI = `mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}/${mongodb_database}?retryWrites=true`;
var database = mongoose.connect(atlasURI).then(console.log("MongoDB connected"));
const store = new MongoDBSession({
    uri: atlasURI,
    collection: 'sessions',
    crypto: {
        secret: mongodb_session_secret
    }
});
module.exports.database = database;
module.exports.store = store;