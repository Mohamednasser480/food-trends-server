const express = require('express');
const Order = express.Router();
const orderModel = require('../models/Order');
const jwt = require('jsonwebtoken');
const orderController = require("../controllers/order")

// Get all orders
Order.get('/', orderController.getAllOrders);
// Get order by id
Order.get('/:id', orderController.getOrder);
// Create new order
Order.post('/', orderController.createOrder);
// Update order by id
Order.put('/:id', orderController.updateOrder);
// delete order by id
Order.delete('/:id', orderController.deleteOrder);

module.exports = Order;
