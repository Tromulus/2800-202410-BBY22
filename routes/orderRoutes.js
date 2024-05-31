//niko wang - setting some routes. all routes are protected by sessionValidation middleware.
const express = require('express');
const { placeOrderController, placeOrderController2, orderDetailController, trackingController } = require('../controllers/orderController');
const sessionValidation = require('../middlewares/sessionValidation');
const router = express.Router();

// may not need get /placeOrder, nor post /placeOrder
router.get('/placeOrder', sessionValidation, (req, res) => res.render('placeOrder'));
// backup plan for our placing order page.
router.post('/placeOrder', sessionValidation, placeOrderController);

// All-in-one placing order (address + payment)
router.post('/placeOrder2', sessionValidation, placeOrderController2);

router.get('/orderDetail', sessionValidation, orderDetailController);

router.get('/tracking/:orderNumber', sessionValidation, trackingController);

module.exports = router;
