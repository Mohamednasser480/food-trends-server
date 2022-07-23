const express = require('express');
const productModel = require('../models/product')
const auth = require('../middleware/auth');

const product = express.Router();

product.get('/',auth,async (req,res)=>{
    try{
        const products = await productModel.find({vendor:req.user._id});
         res.status(200).send(products);
        //res.status(200).send(products);
    }catch (err){
        res.status(400).send(err);
    }
});


product.get('/:id',auth,async (req,res)=>{
    try{
        const product = await productModel.findOne({_id:req.params.id, vendor:req.user._id});
        if(!product) return res.status(404).send();
        res.status(200).send(product);
    }catch (err){
        res.status(400).send(err);
    }
});


product.post('/',auth,async (req,res)=>{
    try {
        const savedProduct = new productModel({...req.body,vendor:req.user._id});
        await savedProduct.save();
        res.status(201).send(savedProduct);
    }catch (err){
        res.status(400).send(err);
    }
});

product.delete('/:id',auth,async (req,res)=>{
    try{
        const product = await productModel.findOneAndDelete({_id:req.params.id, vendor:req.user._id});
        if(!product) return res.status(404).send();
        res.send(product);
    }catch (e){
        res.status(400).send(e);
    }
});
product.patch('/:id',auth,async (req,res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'summary','description','images','category','price','inStock','discount'];
    const isValidUpdate = updates.every( update => allowedUpdates.includes(update));
    if(!isValidUpdate) return res.status(400).send({error:'Invalid update!'});
    try{
        const updatedProduct = await productModel.findOneAndUpdate({_id:req.params.id,vendor:req.user._id},req.body,{new:true,runValidators:true});
        if(!updatedProduct) return res.status(404).send();
        updates.forEach( update=> updatedProduct[update] = req.body[update]);
        await updatedProduct.save();
        res.send(updatedProduct);
    }catch (e){
        res.status(400).send(e);
    }
})
module.exports = product;