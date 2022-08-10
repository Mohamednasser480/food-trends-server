const express = require('express');
const auth = require('../middleware/auth');
const Router = express.Router();
const cartController = require('../controllers/cart');

// add Cart Item
Router.post('/',auth,cartController.addCartItem);
// Update Cart Items
Router.patch('/',auth,cartController.updateCart);
// put Cart Items
Router.put('/',auth,cartController.putCartProducts)
// get all customer cart items
Router.get('/',auth,cartController.getAllCartItems);
// set products items
Router.delete('/',auth,cartController.deleteCartProduct);

module.exports = Router;