const express = require('express');
const Order = express.Router();
const auth = require('../middleware/auth');
const orderController = require("../controllers/order")

// Get all orders
Order.get('/',auth, orderController.getAllOrders);
// Create new order
Order.post('/', auth, orderController.createOrder);
// Cancel Order
Order.delete('/:id',auth,orderController.cancelOrder);
Order.post('/save',auth,orderController.saveOrder);
module.exports = Order;
