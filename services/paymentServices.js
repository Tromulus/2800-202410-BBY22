const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function createPaymentIntent(paymentMethodId) {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 5000, // The amount in cents
            currency: 'cad',
            payment_method: paymentMethodId,
            confirmation_method: 'manual',
            confirm: true,
            return_url: 'https://localhost:3000/success', // our success url
        });
        return { paymentIntent };
    } catch (error) {
        return { error: error.message };
    }
}

module.exports = {
    createPaymentIntent,
};
