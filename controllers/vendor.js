const productModel = require("../models/product");

const addProduct = async (req,res)=>{
    try {
        const savedProduct = new productModel({...req.body,vendor:req.user._id});
        await savedProduct.save();
        res.status(201).send(savedProduct);
    }catch (err){
        res.status(400).send(err);
    }
}
const deleteProduct = async (req,res)=>{
    try{
        const product = await productModel.findOneAndDelete({_id:req.params.id, vendor:req.user._id});
        if(!product) return res.status(404).send();
        res.send(product);
    }catch (e){
        res.status(400).send(e);
    }
}
const updateProduct = async (req,res)=>{
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
}
const getAllProducts = async (req,res)=>{
    try {
        const products = await productModel.find({vendor: req.params.id});
        if (!products) res.status(404).send();
        res.send(products);
    }catch (e){
        res.status(400).send('Error: '+e);
    }
}

module.exports = {
    addProduct,
    deleteProduct,
    updateProduct,
    getAllProducts
}