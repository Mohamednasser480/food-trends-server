const ReviewModel = require("../models/Review");
const ProductModel = require('../models/product');
// add review to product
const addReview = async (req,res)=>{
    try{
        const review = new ReviewModel({...req.body, customer:req.user._id});
        const product = await ProductModel.findById(req.body.product);
        product.rate += req.body.rating;
        product.numberOfReviews++;
        await product.save();
        await review.save();
        res.status(201).send(review);
    } catch (e){
        res.status(400).send('Error: '+e);
    }
}
// get all product reviews
const getProductReviews = async(req,res)=>{
    try{
        const productReview = await ReviewModel.find({product: req.params.id}).populate('customer');
        if(!productReview) return res.status(404).send(productReview);
        res.send(productReview);
    }catch (e){
        res.status(400).send('Error '+e);
    }
}
// delete product Review
const deleteProductReview = async(req,res)=>{
    try{
        const review = await ReviewModel.findOne({customer:req.user._id, _id:req.params.id});
        if(!review) return res.status(404).send();
        const product = await ProductModel.findById(review.product);
        product.rate -= review.rating;
        product.numberOfReviews--;
        await product.save();
        await review.remove();
        res.send(review);
    }catch (e){
        res.status(400).send('Error '+e);
    }
}
// update customer review
// the Customer can only update { rating and comment }
const updateProductReview = async (req,res)=>{
    try{
        const updates = Object.keys(req.body);
        const allowedUpdates = ['rating','comment'];
        const isValidUpdate = updates.every(update => allowedUpdates.includes(update));

        if(!isValidUpdate) return res.status(400).send({error:"Invalid updates!"});

        const review = await ReviewModel.findOne({customer:req.user._id, _id: req.params.id});
        if(!review) return  res.status(404).send();
        if(req.body.rating){
            const product = await ProductModel.findById(review.product);
            product.rate -= review.rating;
            product.rate += +req.body.rating;
            await product.save();
        }
        updates.forEach(update => review[update] = req.body[update]);
        await review.save();
        res.send(review);

    }catch (e){
        res.send('Error: '+e);
    }
}

module.exports = {
    addReview,
    getProductReviews,
    deleteProductReview,
    updateProductReview
}