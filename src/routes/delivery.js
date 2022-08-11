const express = require('express');
const Router = express.Router();
const auth = require('../middleware/auth');
const deliveryAuth = require('../middleware/delivery');
const deliveryController = require('../controllers/delivery');

Router.get('/',[auth,deliveryAuth],deliveryController.getAllOrders);

module.exports = Router;