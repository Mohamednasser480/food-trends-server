const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    productName:{type: String, required:true},
    summary:{type:String,required:true},
    description:{type: String},
    images:[
        {
            type: String,
            required:true
        }
    ],
    weight:{type:Number},
    category:{ type: String, required:true },
    price:{ type:Number, required:true },
    inStock:{ type:Number, required:true },
    discount:{type:Number},
    rate:{
        type:Number,
        default:0
    },
    numberOfReviews:{
        type:Number,
        default:0
    },
    vendor:{type: mongoose.Schema.Types.ObjectId, required:true, ref: "User"}
},{ timestamps: true });

module.exports = mongoose.model('Product',ProductSchema);