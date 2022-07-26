const express= require('express');
const reviewController = require('../controllers/review');
const auth = require('../middleware/auth');

const Router = express.Router();

// add customer review
Router.post('/',auth,reviewController.addReview);
// delete customer review by the review id
Router.delete('/:id',auth,reviewController.deleteProductReview);
Router.patch('/:id',auth,reviewController.updateProductReview);

module.exports = Router;