const ReviewModel = require("../models/Review");
const reviewModel = require("../models/Review");

// add review to product
const addReview = async (req,res)=>{
    try{
        const review = new ReviewModel({...req.body, customer:req.user._id});
        await review.save();
        res.status(201).send(review);
    } catch (e){
        res.status(400).send('Error: '+e);
    }
}
// get all product reviews
const getProductReviews = async(req,res)=>{
    try{
        const productReview = await reviewModel.find({product: req.params.id});
        if(!productReview) return res.status(404).send(productReview);
        res.send(productReview);
    }catch (e){
        res.status(400).send('Error '+e);
    }
}
// delete product Review
const deleteProductReview = async(req,res)=>{
    try{
        const review = await reviewModel.findOne({customer:req.user._id, _id:req.params.id});
        if(!review) return res.status(404).send();
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

        const review = await reviewModel.findOne({customer:req.user._id, _id: req.params.id});
        if(!review) return  res.status(404).send();
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