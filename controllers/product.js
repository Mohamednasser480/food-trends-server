const productModel = require("../models/product");
const getAllProducts = async (req,res)=>{
    try{
        const sort = {};
        if(req.query.sortBy){
            const partsOfSort = req.query.sortBy.split(':');
            sort[partsOfSort[0]] = partsOfSort[1] === 'desc'?-1:1;
        }
        const options = {
            limit:req.query.limit,
            skip:req.query.skip,
            sort:sort
        }
        const products = await productModel.find({},null,options);
        // products.sort( (a,b) => b.rate - a.rate);
        // if(req.query.limit) return res.send(products.slice(0,req.query.limit));
        res.send(products);
    }catch (err){
        res.status(400).send(err);
    }
}
const getProduct = async (req,res)=>{
    try{
        const product = await productModel.findOne({_id:req.params.id});
        if(!product) return res.status(404).send();
        res.status(200).send(product);
    }catch (err){
        res.status(400).send(err);
    }
}
module.exports = {
    getAllProducts,
    getProduct
}