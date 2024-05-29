// paymentRoutes.js
const express = require('express');
const router = express.Router();
// const { processPayment } = require('../controllers/paymentController');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Replace with your actual test secret key
const bodyParser = require('body-parser');

// Middleware to parse webhook request
router.post('/webhook', bodyParser.raw({ type: 'application/json' }), (req, res) => {
    console.log("log this");
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        console.log("Log 2" + process.env.STRIPE_WEBHOOK_SECRET);
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET); // Replace with your webhook secret
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        // Fulfill the purchase and update database
        console.log('Payment was successful!', session);
        // Add your database interaction here
        console.log("User has paid and stripe sent me a notification, using webhooks, saying that it is okay for me to start managing my database accordingly.");
    }
    
    res.json({ received: true });
});

router.get('/success', (req, res) => {
    // I may have to update database here instead of webhook.
    res.render('paymentSuccess'); // Assuming paymentSuccess.ejs is your success page
});

// Route for Thomas's checkout.ejs
router.get('/checkout', (req, res) => {
    res.render('checkout'); // Assuming paymentSuccess.ejs is your success page
});

router.get('/book', (req, res) => {
    res.render('bookAndPay'); // Assuming paymentCancel.ejs is your cancel page
});

router.get('/book2', (req, res) => {
    res.render('bookAndPay2'); // Assuming paymentCancel.ejs is your cancel page
});

module.exports = router;
