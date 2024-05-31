//order schema niko wang
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  username: String,
  address: String,
  city: String,
  province: String,
  postal: String,
  orderNumber: Number,
  date: Date,
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  amount: Number
});

module.exports = mongoose.model('Order', orderSchema);
