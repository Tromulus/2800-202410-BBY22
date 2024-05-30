const express = require('express');
const { placeOrderController, placeOrderController2, orderDetailController, trackingController } = require('../controllers/orderController');
const sessionValidation = require('../middlewares/sessionValidation');
const router = express.Router();

// may not need get /placeOrder, nor post /placeOrder
router.get('/placeOrder', sessionValidation, (req, res) => res.render('placeOrder'));
router.post('/placeOrder', sessionValidation, placeOrderController);

// Created for testing combined controller (address + payment)
router.post('/placeOrder2', sessionValidation, placeOrderController2);

router.get('/orderDetail', sessionValidation, orderDetailController);

router.get('/tracking/:orderNumber', sessionValidation, trackingController);

module.exports = router;
