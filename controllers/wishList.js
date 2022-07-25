const WishlistModel = require("../models/Wishlist");
const addWishlistItem = async(req, res) => {
    try {
        //   get the User WishList
        //   if there is no withList -> create one and set the req.body in it
        //   if there is wishlist -> search if the product is already in the wishlist
        //   if the product not fount in the customer wishlist then add it
        let customerWishList = await WishlistModel.findOne({customer: req.user._id});
        if(!customerWishList) {
            const wishList = new WishlistModel({products:[res.body.product],customer:req.user._id});
            await wishList.save();
            return res.status(201).send(wishList);
        }
        const index = customerWishList.products.findIndex(wishListProduct => wishListProduct.product == req.body.product);
        if(index !== -1 )return res.send(customerWishList);
        customerWishList.products.push(req.body);
        await customerWishList.save();
        res.send(customerWishList);
    } catch (e) {

        res.status(400).send("error " + e);
    }
}

const getWishlistItems =  async (req, res) => {
    try {
        const customerWishList = await WishlistModel.findOne({customer:req.user._id});
        if(! customerWishList) return res.status(404).send();
        res.send(customerWishList);
    } catch (e) {
        res.status(400).send('error ', e);
    }
}
const deleteWishlistItem = async (req, res) => {
    try {
        const customerWishList = await WishlistModel.findOne({customer:req.user._id});
        customerWishList.products = customerWishList.products.filter( wishlistProduct => wishlistProduct.product != req.params.id);
        await customerWishList.save();
        res.send(customerWishList);
    } catch (e) {
        res.status(400).send('error '+ e);
    }
}
module.exports = {
    addWishlistItem,
    getWishlistItems,
    deleteWishlistItem
}