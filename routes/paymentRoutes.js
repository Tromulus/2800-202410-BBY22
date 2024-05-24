// paymentRoutes.js
const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Replace with your actual test secret key
const bodyParser = require('body-parser');

// Used for redirecting to Stripe's checkout page
router.post('/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                // Price ID is the most unique, as a product can have multiple prices.
                price: 'price_1PJN4l00K9SfgrcVQPTPodPv', // Replace with your price ID.
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel',
    });
    res.json({ id: session.id });
    // res.redirect("/checkout");
}); // session id sent to front end to go to Stripe's checkout page

// Custom checkout page route
// router.post('/process-payment', async (req, res) => {
//     // Retrieve payment information from the request body
//     const { cardNumber, cardName, cardExpiry, cardCvc, email, amount } = req.body;

//     try {
//         // Create a Payment Intent to process the payment
//         const paymentIntent = await stripe.paymentIntents.create({
//             amount: parseInt(amount), // Amount in cents (e.g., $50.00)
//             currency: 'cad',
//             description: 'Example Product',
//             payment_method_types: ['card'],
//             confirmation_method: 'manual',
//             confirm: true,
//             receipt_email: email, // Pass the customer's email to Stripe
//             payment_method: {
//                 card: {
//                     number: cardNumber,
//                     exp_month: cardExpiry.split('/')[0].trim(), // Extract month from MM/YY format
//                     exp_year: cardExpiry.split('/')[1].trim(),  // Extract year from MM/YY format
//                     cvc: cardCvc,
//                     name: cardName
//                     // for storing in database, store everything EXCEPT CVV code.
//                     // CVV code is used only at transaction.
//                     // tokenize at LEAST card number
//                 }
//             }
//         });

//         // If payment is successful, respond with success message
//         res.status(200).json({ message: 'Payment successful' });
//     } catch (error) {
//         // Handle any errors and send an error response
//         console.error('Error processing payment:', error);
//         res.status(500).json({ error: 'Failed to process payment' });
//     }
// });

router.post('/process-payment', async (req, res) => {
    const { paymentMethodId } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 5000, // The amount in cents
            currency: 'cad',
            payment_method: paymentMethodId,
            confirmation_method: 'manual',
            confirm: true,
            return_url: 'https://localhost:3000/success', // Replace with your success URL
        });

        // Handle successful payment
        // You can add code here to update your database or perform other actions
        // Once the payment is successful, redirect the user to the success page
        console.log("succeeded. Now fix this part.");
        res.redirect('/success');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Middleware to parse webhook request
router.post('/webhook', bodyParser.raw({ type: 'application/json' }), (req, res) => {
    console.log("log this");
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        console.log("Log 2" + process.env.STRIPE_WEBHOOK_SECRET);
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET); // Replace with your webhook secret
    } catch (err) {
        console.log("Log 3 err");
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    console.log("Log 4 normal");
    
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        // Fulfill the purchase and update database
        console.log('Payment was successful!', session);
        // Add your database interaction here
        console.log("User has paid and stripe sent me a notification, using webhooks, saying that it is okay for me to start managing my database accordingly.");
    }
    console.log("Log 5 normal");
    
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
