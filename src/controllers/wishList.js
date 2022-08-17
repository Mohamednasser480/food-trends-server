const WishlistModel = require("../models/Wishlist");
const addWishlistItem = async(req, res) => {
    try {
        //   get the User WishList
        //   if there is no withList -> create one and set the req.body in it
        //   if there is wishlist -> search if the product is already in the wishlist
        //   if the product not fount in the customer wishlist then add it
        let customerWishList = await WishlistModel.findOne({customer: req.user._id}).populate('products.product');
        if(!customerWishList) {
            const wishList = new WishlistModel({products:[req.body],customer:req.user._id});
            await wishList.save();
            return res.status(201).send(wishList);
        }
        const index = customerWishList.products.findIndex(wishListProduct => wishListProduct.product.toString() === req.body.product);
        if(index !== -1 )return res.send(customerWishList);
        customerWishList.products.push(req.body);
        await customerWishList.save();
        res.send(customerWishList);
    } catch (e) {
        res.status(400).send({error:e.message,code:400});
    }
}
const getWishlistItems =  async (req, res) => {
    try {
        const customerWishList = await WishlistModel.findOne({customer:req.user._id}).populate('products.product');
        if(! customerWishList) return res.status(404).send({error:'products not found',code:404});
        res.send(customerWishList);
    } catch (e) {
        res.status(400).send({error:e.message,code:400});
    }
}
const deleteWishlistItem = async (req, res) => {
    try {
        const customerWishList = await WishlistModel.findOne({customer:req.user._id}).populate('products.product');
        if(!customerWishList) return res.status(404).send({error:'product not found',code:404});
        customerWishList.products = customerWishList.products.filter( wishlistProduct => wishlistProduct.product.toString() !== req.params.id);
        await customerWishList.save();
        res.send(customerWishList);
    } catch (e) {
        res.status(400).send({error:e.message,code:400});
    }
}
module.exports = {
    addWishlistItem,
    getWishlistItems,
    deleteWishlistItem
}