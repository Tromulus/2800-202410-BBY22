require('dotenv').config();
const session = require('express-session');
const mongoose = require('mongoose');
const MongoDBSession = require('connect-mongodb-session')(session);
const mongodb_host = process.env.MONGODB_HOST;
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const atlasURI = `mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}/?retryWrites=true`;
var database = mongoose.connect(atlasURI).then(console.log("MongoDB connected"));
const store = new MongoDBSession({
    uri: atlasURI,
    collection: 'sessions'
});
module.exports = {database};