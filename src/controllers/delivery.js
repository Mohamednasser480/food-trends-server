const orderModel = require('../models/Order');
const getAllOrders = async (req,res)=>{
    try{
        const options = {
            limit: req.query.limit,
            skip: req.query.skip
        }
        const filterObj = {};

        filterObj.status = 'pending';
        const count = await orderModel.find(filterObj).count();
        let orders = await orderModel.find(filterObj,null,options).populate('products.product').populate('customer');
        const city = (req.query.city)? req.query.city.toLowerCase() : '';
        const gov = (req.query.gov)? req.query.gov.toLowerCase() : '';
        orders = orders.filter(order => order.customer.address.city.includes(city)  && order.customer.address.governorate.includes(gov));
        if(!orders) res.status(404).send('Orders Not Found !!');
        res.send({data:orders,count});
    }catch (e){
        res.status(400).send(e.message)
    }
}
module.exports = {
    getAllOrders,
}