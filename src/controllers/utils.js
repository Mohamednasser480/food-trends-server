const cartModel = require("../models/Cart");
const wishlistModel = require("../models/Wishlist");
// delete Customer cart
// delete Customer wishlist
const deleteCustomer = async (customerId)=>{
    // Delete user wishlist
    await wishlistModel.deleteOne({customer: customerId});
    // Delete user cart
    await cartModel.deleteOne({customer:customerId});
}
const deleteProductUtil = async (productId)=>{
    // delete the product from all carts
    const carts = await cartModel.find({products:{$elemMatch:{product:productId}}}).populate('products.product');
    for(let cart of carts) {
        const index = cart.products.findIndex(product => product.product._id.toString() === productId.toString());
        cart.cartPrice -= cart.products[index].quantity * cart.products[index].product.price;
        cart.products.splice(index, 1);
        await cart.save();
    }
    // delete the product from all wishlists
    const wishlists = await wishlistModel.find({products:{$elemMatch:{product:productId}}}).populate('products.product');
    for(let wishlist of wishlists) {
        wishlist.products = wishlist.products.filter(product => product.product._id.toString() !== productId.toString());
        await wishlist.save();
    }
}
const deleteVendor = async (req,res)=>{

}
const deleteDelivery = async (req,res)=>{

}
module.exports ={
    deleteCustomer,
    deleteVendor,
    deleteDelivery,
    deleteProductUtil
}

// cart1   9.85 * 2
// cart2    5 * 9.85 + 10 * 12.84