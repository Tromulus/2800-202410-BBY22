const Order = require('../models/order');
const crypto = require('crypto');
const axios = require('axios');

async function getCoordinates(address) {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
            address: address,
            key: process.env.GOOGLE_MAPS_API_KEY
        }
    });
    const data = response.data;
    if (data.results.length === 0) {
        throw new Error('Address not found');
    }
    const location = data.results[0].geometry.location;
    return {
        latitude: location.lat,
        longitude: location.lng
    };
}

const placeOrderController = async (req, res, next) => {
    try {
        const { street, city, province, postal } = req.body;
        const fullAddress = `${street}, ${city}, ${province}, ${postal}`;
        const coordinates = await getCoordinates(fullAddress);
        const orderNumber = crypto.randomInt(100000000, 999999999);
        const order = new Order({
            username: req.session.username,
            address: fullAddress,
            city: city,
            province: province,
            postal: postal,
            coordinates: coordinates,
            orderNumber: orderNumber,
            date: new Date()
        });
        await order.save();
        res.redirect('/orderDetail');
    } catch (error) {
        next(error);
    }
};

const orderDetailController = async (req, res, next) => {
    try {
        const orders = await Order.find({ username: req.session.username });
        const cart = req.session.cart ? req.session.cart : null;
        res.render('orderDetail', { authenticated: req.session.authenticated, orders: orders, cart: cart });
    } catch (error) {
        next(error);
    }
};

const trackingController = async (req, res, next) => {
    try {
        const orderNumber = req.params.orderNumber;
        const order = await Order.findOne({ orderNumber: parseInt(orderNumber) });
        if (!order) {
            res.status(404).send('Order not found');
            return;
        }
        const cart = req.session.cart ? req.session.cart : null;
        res.render('tracking', { authenticated: req.session.authenticated, order: order, cart: cart, google_maps_api_key: process.env.GOOGLE_MAPS_API_KEY });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    placeOrderController,
    orderDetailController,
    trackingController
};
