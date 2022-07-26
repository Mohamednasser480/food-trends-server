const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name:{type: String, required:true},
    summary:{type:String,required:true},
    description:{type: String},
    images:[
        {
            type: String,
            required:true
        }
    ],
    category:{ type: String },
    price:{ type:Number, required:true },
    inStock:{ type:Number, required:true },
    discount:{type:Number},
    vendor:{type: mongoose.Schema.Types.ObjectId, required:true, ref: "User"}
});

module.exports = mongoose.model('Product',ProductSchema);