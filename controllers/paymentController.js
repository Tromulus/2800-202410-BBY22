const { createPaymentIntent } = require('../services/paymentServices');

async function processPayment(req, res) {
    const { paymentMethodId } = req.body;
    const { paymentIntent, error } = await createPaymentIntent(paymentMethodId);

    if (error) {
        return res.status(500).json({ error });
    }

    // Handle successful payment
    // You can add code here to update your database or perform other actions
    // Once the payment is successful, redirect the user to the success page
    res.redirect('/success');
}

module.exports = {
    processPayment,
};
