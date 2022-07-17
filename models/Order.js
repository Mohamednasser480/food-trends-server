const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    totalPrice: { type: String, required: true },
    products: [{ productId: { type: mongoose.Schema.Types.ObjectId , ref:"Product"}, quantity: { type: Number } }],
    customerId: { type: mongoose.Schema.Types.ObjectId , ref:"User"},
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
