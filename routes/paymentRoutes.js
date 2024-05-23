// paymentRoutes.js
const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Replace with your actual test secret key
const bodyParser = require('body-parser');

router.post('/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'cad',
                    product_data: {
                        name: 'Example Product',
                    },
                    unit_amount: 5000, // $50.00 in cents
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel',
    });
    res.json({ id: session.id });
}); // "Use the session ID returned from this post to redirect users to Stripe Checkout."

// Middleware to parse webhook request
router.post('/webhook', bodyParser.raw({ type: 'application/json' }), (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET); // Replace with your webhook secret
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        // Fulfill the purchase and update database
        console.log('Payment was successful!', session);
        // Add your database interaction here
    }

    res.json({ received: true });
});

// Route for payment success
router.get('/success', (req, res) => {
    res.render('paymentSuccess'); // Assuming paymentSuccess.ejs is your success page
});

// Route for payment cancellation
router.get('/cancel', (req, res) => {
    res.render('paymentCancel'); // Assuming paymentCancel.ejs is your cancel page
});

// Route for paying
router.get('/book', (req, res) => {
    res.render('bookAndPay'); // Assuming paymentCancel.ejs is your cancel page
});

module.exports = router;
