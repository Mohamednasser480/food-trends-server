const mongoose = require('mongoose');
const productModel = require('./product');
const cartModel = require('./Cart');

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
        enum: ['pending', 'assigned','completed'],
        type:String,
        required:true,
        default:'pending'
    },
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    expectedDeliveryDate:{
      type:Date,
    },
    delivery:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
},{ timestamps: true });



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
