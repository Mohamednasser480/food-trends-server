const orderModel = require('../models/Order');
const getAllOrders = async (req,res)=>{
    try{
        const options = {
            limit: req.query.limit,
            skip: req.query.skip
        }
        const filterObj = {};
        if(req.query.city) filterObj.city = req.query.city;
        if(req.query.government) filterObj.government = req.query.government;

        filterObj.status = 'pending';
        const count = await orderModel.find(filterObj).count();
        const orders = await orderModel.find(filterObj,null,options).populate('products.product').populate('customer');
        if(!orders) res.status(404).send('Orders Not Found !!');
        res.send({data:orders,count});
    }catch (e){
        res.status(400).send(e.message)
    }
}
module.exports = {
    getAllOrders,
    updateOrder
}