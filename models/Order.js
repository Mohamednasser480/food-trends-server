const mongoose = require('mongoose');
const productModel = require('../models/product');
const cartModel = require('../models/Cart');

const OrderSchema = new mongoose.Schema({
    products:[{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity:{
            type:Number,
            required:true,
            min:1,
            default:1
        }
    }],
    totalPrice:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        required:true,
        default:'pending'
    },
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
},{ timestamps: true });

OrderSchema.post('save',async function(doc){
    // Update in stock instances of the ordered product
    doc.products.forEach( (productObj) =>{
        productModel.findById(productObj.product, (err,product)=>{
            product.inStock -= productObj.quantity;
            product.save();
        });
    });
    // remove ordered product from the customer cart
    const customerCart = await cartModel.findOne({customer:doc.customer});
    const newCart = customerCart.products.filter( cart => {
        const index = doc.products.findIndex( orderObj => {
            return orderObj.product.toString() === cart.product.toString()
        } );
        return index === -1;
    });
    customerCart.products = newCart;
    customerCart.save();
});

OrderSchema.pre('remove', async function(next){
    this.products.forEach( (productObj) =>{
        productModel.findById(productObj.product, (err,product)=>{
            if(err) throw new Error(err);
            product.inStock += productObj.quantity;
            product.save();
        });
    });
    next();
});

module.exports = mongoose.model('Order', OrderSchema);
