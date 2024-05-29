const Order = require('../models/order');
const crypto = require('crypto');
const axios = require('axios');
const { createPaymentIntent } = require('../services/paymentServices');


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
        const fullAddress = `${street}, ${city}`;
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

// Combined controller for address + payment -- by Sunwoo
const placeOrderController2 = async (req, res, next) => {
    try {
        const { street, city, province, postal, paymentMethodId, amount } = req.body;

        console.log("Street: " + street);
        console.log("City: " + city);
        
        // Create order number and full address
        const fullAddress = `${street}, ${city}`;
        const coordinates = await getCoordinates(fullAddress);
        const orderNumber = crypto.randomInt(100000000, 999999999);

        // Process payment using service imported
        const { paymentIntent, error } = await createPaymentIntent(paymentMethodId, amount);

        // if payment got error
        if (error) {
            return res.status(500).json({ error });
        }

        // If payment is successful, save order
        if (paymentIntent.status === 'succeeded' || paymentIntent.status === 'requires_action') {
            const order = new Order({
                username: req.session.username,
                address: fullAddress,
                city: city,
                province: province,
                postal: postal,
                coordinates: coordinates,
                orderNumber: orderNumber,
                date: new Date(),
                amount: amount / 100
            });
            await order.save();

            const redirectURL = '/tracking/' + orderNumber;
            res.redirect(redirectURL);
        } else {
            res.status(400).json({ error: 'Payment failed or requires additional action.' });
        }
    } catch (error) {
        next(error);
    }
};
// Sunwoo's section ends --

const orderDetailController = async (req, res, next) => {
    try {
        const orders = await Order.find({ username: req.session.username });
        const cart = req.session.cart ? req.session.cart : null;

        if (!cart || !cart.models || Object.keys(cart.models).length === 0) {
            res.render('orderDetail', { authenticated: req.session.authenticated, orders: orders, cart: null, errorMessage: 'Shopping cart is empty.' });
        } else {
            res.render('orderDetail', { authenticated: req.session.authenticated, orders: orders, cart: cart, errorMessage: null });
        }
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
    placeOrderController2,
    orderDetailController,
    trackingController
};
