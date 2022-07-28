const express = require('express');
const auth = require('../middleware/auth');
const Router = express.Router();
const cartController = require('../controllers/cart');

// add Cart Item
Router.post('/',auth,cartController.addCartItem);
// Update Cart Items
Router.patch('/',auth,cartController.updateCart);
// get all customer cart items
Router.get('/',auth,cartController.getAllCartItems);

module.exports = Router;