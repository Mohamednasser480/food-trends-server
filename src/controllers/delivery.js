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
        // orders = orders.filter(order => order.customer !== null);
        orders = orders.filter(order => order.customer.address.city.includes(city)  && order.customer.address.governorate.includes(gov));
        if(!orders) res.status(404).send({error:'Orders Not Found',code:404});
        res.send({data:orders,count});
    }catch (e){
        res.status(400).send({error:e.message,code:400});
    }
}
const assignOrder = async (req,res)=>{
    try{
        const order = await orderModel.findById(req.body.id).populate('products.product').populate('customer');
        if(!order) return res.status(404).send({error:'Order not found',code:404});
        order.delivery = req.user._id;
        order.status = 'assigned';

        const dt = new Date();
        dt.setDate(dt.getDate() + 1)
        order.expectedDeliveryDate = `${dt.getFullYear()}-${dt.getMonth()+1}-${dt.getDate()}`;

        await order.save();
        res.send(order);
    }catch (e){
        res.status(400).send({error:e.message,code:400});
    }
}
const getDeliveryOrders = async(req,res)=>{
    try{
        const filterObj = {};
        filterObj.delivery = req.user._id;
        if(req.query.status)
            filterObj.status = req.query.status;
        const deliveryOrders = await orderModel.find(filterObj).populate('products.product').populate('customer');
        if(!deliveryOrders) return res.status(404).send({message:'Orders not found',code:404});
        res.send(deliveryOrders);
    }catch (e){
        res.status(400).send({error:e.message,code:400});
    }
}
const updateOrderStatus = async(req,res)=>{
    try{
        const order = await orderModel.findOne({delivery:req.user._id, _id:req.body.id});
        if(!order) return res.status(404).send({error:'Order not found',code:404});

        order.status = req.body.status;

        if(req.body.status === "pending") {
            order.delivery = null;
            order.expectedDeliveryDate = null;
        }

        await order.save();
        res.send(order);
    }catch (e){
        res.status(400).send({error:e.message,code:400});
    }
}
module.exports = {
    getAllOrders,
    assignOrder,
    getDeliveryOrders,
    updateOrderStatus
}
