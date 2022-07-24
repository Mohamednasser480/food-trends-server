const mongoose = require('mongoose');
const Cart = new mongoose.Schema({
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
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Customer',
        required: true
    }
})

module.exports =  mongoose.model('Cart',Cart);