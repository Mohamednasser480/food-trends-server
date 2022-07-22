const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name:{type: String, require:true},
    summary:{type:String,require:true},
    description:{type: String, require: true, unique:true},
    images:{type: String, require:true},
    category:{ type: Array },
    price:{ type:Number, require:true },
    inStock:{ type:Number, require:true },
    discount:{type:Number},
    user:{type: mongoose.Schema.Types.ObjectId, ref: "user"}
});

module.exports = mongoose.model('Product',ProductSchema);