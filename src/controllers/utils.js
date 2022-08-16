const wishlistModel = require("../models/Wishlist");
const cartModel = require("../models/Cart");

// delete Customer cart
// delete Customer wishlist
const deleteCustomer = async (customerId)=>{
    // Delete user wishlist
    await wishlistModel.deleteOne({customer: customerId});
    // Delete user cart
    await cartModel.deleteOne({customer:customerId});
}
const deleteVendor = async (req,res)=>{

}
const deleteDelivery = async (req,res)=>{

}
module.exports ={
    deleteCustomer,
    deleteVendor,
    deleteDelivery
}