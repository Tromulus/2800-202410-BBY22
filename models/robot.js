const mongoose = require('mongoose');

const robotSchema = new mongoose.Schema({
    manufacturer: String,
    model: String,
    price: Number,
    serial: String,
    capabilities: [String],
    operatingTime: Number,
    battery: Number, 
    status: String,
    location: {
        latitude: Number, 
        longitude: Number
    }
}, {collection: 'robots'});

module.exports = mongoose.model('Robot', robotSchema);