const orderModel = require('../models/Order');
const productModel = require('../models/product');
const reviewAuth = async (req,res,next) =>{
    try {
        // the Vendor who is the owner of this product can write review
        if(req.user.userType === 'vendor'){
            const product = await productModel.findById(req.body.product);
            console.log(product.vendor, req.user._id);
            if(product.vendor.toString() === req.user._id.toString()) return next();
            else  throw new Error();
        }
        // if not vendor then you should buy this product to write a review
        // get all customer orders
        const customerOrders = await orderModel.find({customer: req.user._id});
        // find the product in the customer orders which the order status is not pending
        const authorized = customerOrders.some( order => order.status ==='completed'&&
                        order.products.some(orderProduct=> orderProduct.product.toString() === req.body.product));
        if(authorized)  return next();
        else throw new Error();
    }catch (e){
        res.status(401).send({error:'authentication error!',code:401});
    }
}
module.exports = reviewAuth;