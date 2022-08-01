const express = require('express');
const auth = require('../middleware/auth');
const vendorAuth = require('../middleware/vendorRole');
const productController = require('../controllers/product');
const reviewController = require('../controllers/review');
const Router = express.Router();

// Get all vendor products
Router.get('/',auth,productController.getAllProducts);
// get vendor product by product id
Router.get('/:id',auth,productController.getProduct);
// add product
Router.post('/',[auth, vendorAuth],productController.addProduct);
// delete product
Router.delete('/:id',[auth, vendorAuth] ,productController.deleteProduct);
// update product
Router.patch('/:id',[auth, vendorAuth],productController.updateProduct);
// get product Review
Router.get('/:id/reviews',reviewController.getProductReviews);

Router.get('/mostSimilar/:id',productController.getMostSimilar);

module.exports = Router;