const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function createPaymentIntent(paymentMethodId, totalAmount) {
    console.log("Total amount: " + totalAmount)
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalAmount, // The amount in cents
            currency: 'cad',
            payment_method: paymentMethodId,
            confirmation_method: 'manual',
            confirm: true,
            return_url: 'https://ourURL', // needs to exist, but won't be used.
        });
        return { paymentIntent };
    } catch (error) {
        return { error: error.message };
    }
}

module.exports = {
    createPaymentIntent,
};
