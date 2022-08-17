const express = require('express');
const adminController = require('../controllers/admin');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/admin');
const Router = express.Router();

Router.get('/users',[auth,adminAuth],adminController.getUsers);
Router.put('/users/:id',[auth,adminAuth],adminController.changeUserStatus);
Router.delete('/users',[auth,adminAuth],adminController.deleteUser);
Router.get('/products',[auth,adminAuth],adminController.getProducts);
Router.put('/products',[auth,adminAuth],adminController.changeProductStatus);

module.exports = Router;