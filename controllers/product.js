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
        if(req.query.category){
            req.query.category = req.query.category.toLowerCase();
            filterObj.category = req.query.category;
        }
        if(req.query.search){
            req.query.search = req.query.search.toLowerCase();
            filterObj.productName = {"$regex": req.query.search};
        }
        const products = await productModel.find(filterObj,null,options);
        if(!products) return res.status(404).send();
        res.send(products);
    }catch (err){
        console.log(err);
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
const getMostSimilar = async (req,res)=>{
    try{
        const product = await productModel.findById(req.params.id);
        if(!product) res.status(404).send();
        const similarProducts = await productModel.find({category:product.category});
        if(!similarProducts) res.status(404).send();
        // points.sort(function(a, b){return b - a});
        similarProducts.sort((a,b)=> (b.rate/b.numberOfReviews) - (a.rate/a.numberOfReviews));
        res.send(similarProducts.slice(0,4));
    }catch (e){
        res.status(400).send(e);
    }
}

module.exports = {
    getAllProducts,
    getProduct,
    getMostSimilar
}