const cartModel = require("../models/Cart");
const wishlistModel = require("../models/Wishlist");
const productModel = require("../models/product");
const orderModel = require("../models/Order");
const deleteCustomer = async (customerId)=>{
    try {
        // Delete user wishlist
        await wishlistModel.deleteOne({customer: customerId});
        // Delete user cart
        await cartModel.deleteOne({customer: customerId});
    }catch (e){
        throw new Error(e.message);
    }
}
const deleteProductUtil = async (productId)=>{
    try {
        // delete the product from all carts
        const carts = await cartModel.find({products: {$elemMatch: {product: productId}}}).populate('products.product');
        for (let cart of carts) {
            const index = cart.products.findIndex(product => product.product._id.toString() === productId.toString());
            cart.cartPrice -= cart.products[index].quantity * cart.products[index].product.price;
            cart.products.splice(index, 1);
            await cart.save();
        }
        // delete the product from all wishlists
        const wishlists = await wishlistModel.find({products: {$elemMatch: {product: productId}}}).populate('products.product');
        for (let wishlist of wishlists) {
            wishlist.products = wishlist.products.filter(product => product.product._id.toString() !== productId.toString());
            await wishlist.save();
        }
    }catch(e){
        throw new Error(e.message);
    }
}
const deleteVendor = async (vendorId)=>{
    try {
        const products = await productModel.find({vendor: vendorId});
        products.forEach(async (product) => {
            product.inStock = 0;
            product.available = "false";
            await product.save();
            await deleteProductUtil(product._id);
        });
    }catch(e){
        throw new Error(e.message);
    }
}
const deleteDelivery = async (deliveryId)=>{
    try {
        const orders = await orderModel.find({delivery:deliveryId});
        orders.forEach(order=>{
            order.delivery = null;
            order.status = "pending";
            order.expectedDeliveryDate = null;
            order.save();
        });
    }catch (e){
        throw new Error(e.message);
    }
}
module.exports ={
    deleteCustomer,
    deleteVendor,
    deleteDelivery,
    deleteProductUtil,
}