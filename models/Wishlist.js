const mongoose = require('mongoose');


const WishlistSchema = new mongoose.Schema(
  {
    products: [{ productId: { type: mongoose.Schema.Types.ObjectId , ref:"Product"}, quantity: { type: Number, default: 1 } }],
    customerId: { type: mongoose.Schema.Types.ObjectId , ref:"User"},
  },
  { timestamps: true }
);

module.exports = mongoose.model('Wishlist', WishlistSchema);
