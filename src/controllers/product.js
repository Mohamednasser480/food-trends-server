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

        const filterObj = {};
        const maxPrice = req.query.max_price;
        const minPrice = req.query.min_price;
        if(maxPrice && minPrice) filterObj.price = { $lte:maxPrice,$gte:minPrice };
        if(req.query.category)
            filterObj.category = {"$regex": req.query.category,'$options':'im'};

        if(req.query.search){
            req.query.search = req.query.search.toLowerCase();
            filterObj.productName = {"$regex": req.query.search,'$options':'i'};
        }
        const count = await productModel.find(filterObj,null).count();
        const products = await productModel.find(filterObj,null,options);
        if(!products) return res.status(404).send({error:'Products not found',code:404});

        res.send({data:products,count});
    }catch (e){
        res.status(400).send({error:e.message,code:400});
    }
}
const getProduct = async (req,res)=>{
    try{
        const product = await productModel.findOne({_id:req.params.id});
        if(!product) return res.status(404).send({error:'Product not found',code:404});
        res.status(200).send(product);
    }catch (e){
        res.status(400).send({error:e.message,code:400});
    }
}
const getCategories = async (req,res)=>{
    try{
        const result = await productModel.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);
        res.send(result);
    }catch (e){
        res.status(400).send({error:e.message,code:400});
    }
}
module.exports = {
    getAllProducts,
    getProduct,
    getCategories
}