const productModel = require("../models/product");
const orderModel = require('../models/Order');
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
    const allowedUpdates = ['name', 'summary','description','images','category','price','inStock','discount','weight'];
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
        const options = {
            limit:req.query.limit,
            skip:req.query.skip
        }
        let filterObj = {};
        filterObj.vendor = req.params.id
        if(req.query.search){
            req.query.search = req.query.search.toLowerCase();
            filterObj.productName = {"$regex": req.query.search,'$options':'i'};
        }
        const count = await productModel.find(filterObj).count();
        const products = await productModel.find(filterObj,null,options);

        if (!products) res.status(404).send('Products Not Found !!');
        res.send({data:products,count});
    }catch (e){
        res.status(400).send('Error: '+e);
    }
}
const getAllOrders = async (req,res)=>{
 try {
     let sort = {};
     if(req.query.sortBy){
         const partsOfSort = req.query.sortBy.split(':');
         sort[partsOfSort[0]] = partsOfSort[1] === 'desc'?-1:1;
     }
     else sort = {"createdAt":-1};
     const filterObj = {};
     if(req.query.status)
         filterObj.status = req.query.status;

     const options = {
         limit:req.query.limit,
         skip:req.query.skip,
         sort:sort
     }
     const vendorProducts = await productModel.find({vendor: req.user._id});
     const count = await  orderModel.find({'products': {$elemMatch: {product:{$in:vendorProducts}}},...filterObj}).count();
     const allOrders = await orderModel.find({'products': {$elemMatch: {product:{$in:vendorProducts}}},...filterObj},
                                         {'products.$' : 1,'totalPrice':1,'status':1,'customer':1,'createdAt':1}, options).populate('products.product').populate('customer');
     if(!allOrders) return res.status(404).send('Orders Not Found !!');
     res.send({data:allOrders,count});
 }catch (e){
     res.status(400).send(e.message);
 }
}

module.exports = {
    addProduct,
    deleteProduct,
    updateProduct,
    getAllProducts,
    getAllOrders
}