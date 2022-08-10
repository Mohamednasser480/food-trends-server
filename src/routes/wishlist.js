const express = require('express');
const wishlistController = require('../controllers/wishList');
const auth = require('../middleware/auth');

const Router = express.Router();

Router.post('/',auth,wishlistController.addWishlistItem);
Router.get('/', auth,wishlistController.getWishlistItems);
Router.delete('/:id', auth,wishlistController.deleteWishlistItem);
module.exports = Router;
