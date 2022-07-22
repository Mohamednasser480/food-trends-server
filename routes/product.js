const express = require('express');
const productModel = require('../models/product')
const product = express.Router();


product.get('/',async (req,res)=>{
    try{
        const products = await productModel.find({}); //to be populated if wanted
        res.status(200).send(products);
    }catch (err){
        res.status(400).send(err);
    }
});


product.get('/:id',async (req,res)=>{
    try{
        const products = await productModel.find({_id:req.params.id}); //to be populated if wanted
        res.status(200).send(products);
    }catch (err){
        res.status(400).send(err);
    }
});


product.post('/',async (req,res)=>{
    try {
        const savedProduct = new productModel(req.body);
        await savedProduct.save();
        res.status(200).send(savedProduct);
    }catch (err){
        res.status(400).send(err);
    }
});

product.delete('/:id',async (req,res)=>{
    try{
        const result = await productModel.deleteOne({_id:req.params.id});
        res.status(200).send(result);
    }catch (err){
        res.send()
    }
});
product.put('/:id',async (req,res)=>{
    try {
        const result = await productModel.updateOne({_id: req.params.id}, req.body);
        res.status(200).send(result);
    }catch (err){
        res.status(200).send(err);
    }
})
module.exports = product;