const express = require('express');
const { placeOrderController, orderDetailController, trackingController } = require('../controllers/orderController');
const sessionValidation = require('../middlewares/sessionValidation');
const router = express.Router();

router.get('/placeOrder', sessionValidation, (req, res) => res.render('placeOrder'));
router.post('/placeOrder', sessionValidation, placeOrderController);

router.get('/orderDetail', sessionValidation, orderDetailController);

router.get('/tracking/:orderNumber', sessionValidation, trackingController);

module.exports = router;
