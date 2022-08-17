const userModel = require('../models/User');
const productModel = require('../models/product');
const utils = require('./utils');
const {deleteProductUtil} = require("./utils");

const getUsers = async (req,res)=>{
    try{
        const filterObj = {};
        if(req.query.name){
            filterObj.name = {"$regex":  req.query.name,'$options':'i'}
        }
        if(req.query.verified === undefined &&  req.query.user_type )
            filterObj.userType = req.query.user_type;
        if(req.query.verified){
            filterObj.verified = req.query.verified;
            if(req.query.user_type === 'delivery' || req.query.user_type ==='vendor')
                filterObj.userType = req.query.user_type;
            else
                filterObj.userType = { $in: ['vendor','delivery'] };
        }
        if(req.query.available)
            filterObj.available = req.query.available;
        const options = {
            limit: req.query.limit,
            skip:req.query.skip,
            sort:{createdAt:-1}
        }
        const count = await userModel.find(filterObj,null).count();
        const users = await userModel.find(filterObj,null,options);
        if(!users) res.status(404).send({error:'users not found',code:404});
        res.send({data:users,count});
    }catch (e){
        res.send({error:e.message,code:400});
    }
}
const changeUserStatus = async (req,res)=>{
    try{
        const user = await userModel.findById(req.params.id);
        if(!user)res.status(404).send({error:'user not found',code:404});
        user.verified = req.body.verified;
        await user.save();
        res.send(user);
    }catch (e){
        res.status(400).send({error:e.message,code:400});
    }
}
const deleteUser = async (req,res)=>{
    try{
        const user = await userModel.findById(req.body.id);
        if(!user) return res.status(404).send({error:"user not found",code:404});
        if(user.available) {
            user.available = false;
            user.email += `.${user._id}.deleted`;
            await user.save();
        }
        if(user.userType === 'customer')
            await utils.deleteCustomer(user._id);
        else if(user.userType === 'vendor')
            await utils.deleteVendor(user._id);
        else if(user.userType === 'delivery')
            await utils.deleteDelivery(user._id);

        res.send();
    }catch (e){
        res.status(400).send({error:e.message,code:400});
    }
}
const getProducts = async (req,res)=>{
    try {
        const options = {
            limit: req.query.limit,
            skip: req.query.skip,
            sort:{createdAt:-1}
        }
        const filterObj = {};
        if(req.query.available) 
        filterObj.available = req.query.available;
        if(req.query.search)
        filterObj.productName = {"$regex":  req.query.search,'$options':'i'}
        console.log(filterObj)
        const count =  await productModel.find(filterObj).count();
        const products = await productModel.find(filterObj, null, options).populate('vendor');
        if (!products) return res.status(404).send({error: 'products not found', code: 404});
        res.send({data:products,count});
    }catch (e){
        res.status(400).send({error:e.message,code:400});
    }
}
const changeProductStatus = async (req,res)=>{
    try{
        const product = await productModel.findById(req.body.id);
        if(!product) res.status(404).send({error:'product not found',code:404});
        product.available = req.body.available;
        if(!product.available) {
            product.inStock = 0;
            await deleteProductUtil(product._id);
        }
        await product.save();
        res.send(product);
    }catch (e){
        res.status(400).send({error:e.message,code:400});
    }
}

module.exports = {
    getUsers,
    changeUserStatus,
    deleteUser,
    getProducts,
    changeProductStatus
}
