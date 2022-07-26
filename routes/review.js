const express= require('express');
const ReviewModel = require('../models/Review');
const auth = require('../middleware/auth');
const wishlistController = require("../controllers/wishList");

const Router = express.Router();

Router.post('/',auth,async (req,res)=>{
    res.send('hello');
});

// const Router = express.Router;
// Router.post('/',async(req,res)=>{
//    res.send('hello');
// });
// Router.post('/',auth,async (req,res)=>{
//    try{
//        // const review = new ReviewModel({...req.body, customer:req.user._id});
//        // await review.save();
//        // res.status(201).send(review);
//    } catch (e){
//        res.status(400).send('Error: '+e);
//    }
// });

module.exports = Router;