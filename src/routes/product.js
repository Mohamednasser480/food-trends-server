const express = require('express');
const auth = require('../middleware/auth');
const vendorAuth = require('../middleware/vendorRole');
const productController = require('../controllers/product');
const reviewController = require('../controllers/review');
const Router = express.Router();

// get all products sorted by the product rate
// take limit as optional parameter
Router.get('/',productController.getAllProducts);
// get product by product id
Router.get('/:id',productController.getProduct);
// get product Review
Router.get('/:id/reviews',reviewController.getProductReviews);

module.exports = Router;
