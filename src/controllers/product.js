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
        if(!products) return res.status(404).send('Products Not Found !!');

        res.send({data:products,count});
    }catch (err){
        res.status(400).send(err);
    }
}
const getProduct = async (req,res)=>{
    try{
        const product = await productModel.findOne({_id:req.params.id});
        if(!product) return res.status(404).send('Product Not Found');
        res.status(200).send(product);
    }catch (err){
        res.status(400).send(err);
    }
}
module.exports = {
    getAllProducts,
    getProduct
}