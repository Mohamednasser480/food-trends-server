const express = require('express');
const auth = require('../middleware/auth');
const productController = require('../controllers/product');
const Router = express.Router();

Router.get('/',auth,productController.getAllProducts);
Router.get('/:id',auth,productController.getProduct);
Router.post('/',auth,productController.addProduct);
Router.delete('/:id',auth,productController.deleteProduct);
Router.patch('/:id',auth,productController.updateProduct);

module.exports = Router;