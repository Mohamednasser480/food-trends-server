const orderModel = require("../models/Order");
const cartModel = require("../models/Cart");
const productModel = require("../models/product");
// Get all Customer Order
const getAllOrders = async (req, res) => {
  try{
    const customerOrders = await orderModel.find({customer:req.user._id});
    if(!customerOrders) return res.status(400).send();
    return res.send(customerOrders);
  }catch (e){
    res.status(400).send('Error: ',e);
  }
}
// Create Order by array of products items from cart collection
const createOrder = async (req, res) => {
  try {
    // function take the product ids in the cart collection that the customer want to Order them
    // get the customer cart fields  if the Customer card is Empty throw error
    const customerCart = await cartModel.findOne({customer:req.user._id});
    if(!customerCart) return res.status(400).send('Error: Invalid Operation your cart is empty!!');
    // if the order list is empty throw error
    let productsOrder = req.body.products;
    if(!productsOrder) return res.status(400).send('Error: Invalid Operation checkout list should not be empty!!');
    // map the array productsOrder that contains the product ids to the array of cart object to get the quantity of each product
      productsOrder = customerCart.products.filter( cartItem => {
      const index = productsOrder.findIndex(productOrder => cartItem.product.toString() === productOrder);
      return index !== -1;
    });
    // check the in stock Instances for each product
    let validQuantities = true;
    let totalPrice = 0;
    for(let item of productsOrder){
      const product = await productModel.findById(item.product);
      validQuantities &= (product.inStock >= item.quantity);
      totalPrice += item.quantity * product.price;
    }
    if(!validQuantities)return res.status(400).send('Invalid Order: out of stock');

    const Order = new orderModel({products:productsOrder,customer:req.user._id,totalPrice});
    await Order.save();
    // post save Order Update product in stock instances
    // post Save remove the order product from the cart
    res.send(Order);
  } catch (e) {
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
  cancelOrder
}
