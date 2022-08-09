const {createPayment} = require('../payment/createPayment');
const orderModel = require("../models/Order");

// Get all Customer Order
const getAllOrders = async (req, res) => {
  try{

    let sort = {};
    if(req.query.sortBy){
      const partsOfSort = req.query.sortBy.split(':');
      sort[partsOfSort[0]] = partsOfSort[1] === 'desc'?-1:1;
    }
    else sort = {"createdAt":-1};
    const filterObj = {};
    if(req.query.status)
      filterObj.status = req.query.status;
    filterObj.customer = req.user._id;

    const customerOrders = await orderModel.find(filterObj,null,{sort}).populate('products.product');
    if(!customerOrders) return res.status(400).send();
    return res.send(customerOrders);
  }catch (e){
    res.status(400).send(e.message);
  }
}
// Create Order by array of product objects from cart collection
const createOrder = async (req, res) => {
  try {
    let productsOrder = req.body.products;
    if(!productsOrder) return res.status(400).send('Error: Invalid Operation checkout list should not be empty!!');

    // check the in stock Instances for each product
    let outOfStockProduct;
    productsOrder.forEach( item=>{
      if(!outOfStockProduct &&
          item.product.inStock < item.quantity) outOfStockProduct = item.product.productName;
    });
    if(outOfStockProduct) return res.status(400).send({message:'out of Stock', productName:outOfStockProduct});
    const orderObj = productsOrder.map(item =>  ({ product:item.product._id, quantity:item.quantity }));


    const makeOrderRes = await createPayment(req.body.products);
    if(makeOrderRes.error) throw new Error(makeOrderRes.error);


    const Order = new orderModel({products:orderObj,customer:req.user._id,totalPrice:req.body.totalPrice});
    await Order.save();
    // post save Order Update product in stock instances
    // post Save remove the order product from the cart
    // res.send(productsOrder);

    res.send(makeOrderRes);
  } catch (e) {
    console.log(e);
    res.status(400).send('Error: ' + e);
  }
}
// Cancel the Order if the status is Pending
const cancelOrder = async (req,res)=>{
  try{
    const order = await orderModel.findOne({_id:req.params.id, customer:req.user._id});
    if(!order) return res.status(404).send();
    if(order.status !== 'pending') return res.status(400).send('Invalid Operation: can not cancel this Order');
    // pre remove add the in stock instances
    await order.remove();
    res.send(order);
  }catch (e){
    res.status(400).send('Error: ' + e);
  }
}


module.exports = {
  getAllOrders,
  createOrder,
  cancelOrder,
}
