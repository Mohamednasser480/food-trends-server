const express = require('express');
const auth = require('../middleware/auth');
const vendorAuth = require('../middleware/vendorRole');
const productController = require('../controllers/vendor');
const Router = express.Router();

//get all vendor products
Router.get('/:id',productController.getAllProducts);
// add product
Router.post('/',[auth, vendorAuth],productController.addProduct);
// delete product
Router.delete('/:id',[auth, vendorAuth] ,productController.deleteProduct);
// update product
Router.patch('/:id',[auth, vendorAuth],productController.updateProduct);

module.exports = Router;