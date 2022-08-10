const mongoose = require('mongoose');
const WishlistSchema = new mongoose.Schema({
    products:[{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        }
    }],
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    }
});
module.exports = mongoose.model('Wishlist', WishlistSchema);
