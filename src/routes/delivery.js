const express = require('express');
const Router = express.Router();
const auth = require('../middleware/auth');
const deliveryAuth = require('../middleware/delivery');
const deliveryController = require('../controllers/delivery');

Router.get('/',[auth,deliveryAuth],deliveryController.getAllOrders);
Router.post('/',[auth,deliveryAuth],deliveryController.assignOrder);
Router.get('/me',[auth,deliveryAuth],deliveryController.getDeliveryOrders);
Router.put('/',[auth,deliveryAuth],deliveryController.updateOrderStatus);

module.exports = Router;