const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const Robot = require('../models/robot');
const sessionValidation = require('../middlewares/sessionValidation');

router.get('/robots', sessionValidation, (req, res) => res.render('robots', { username: req.session.username }));

router.get('/add-to-cart/:id', sessionValidation, async (req, res) => {
    var roboName = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : { items: {} });

    const robot = await Robot.findOne({ model: roboName });

    // Add robot to the cart
    cart.add(robot);
    req.session.cart = cart;
    res.redirect('/robots');
});

router.get('/cart', sessionValidation, async (req, res) => {

    const cart = req.session.cart;
    
    if (cart) {
        const cartInstance = new Cart(cart);
        const cartArray = cartInstance.generateArray();
        const cartDetails = [];
        for (const item of cartArray) {
            const robot = await Robot.findOne({ model: item.model });
            if (robot) {
                cartDetails.push({
                    model: robot.model,
                    company: robot.manufacturer,
                    rate: robot.price,
                    capabilities: robot.capabilities,
                    qty: item.qty
                });
            };
        };
        res.render('cart', { cart, cartDetails });
    } else {
        res.redirect('/robots');
    }
});

module.exports = router;