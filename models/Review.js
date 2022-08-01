const mongoose = require('mongoose');
const ReviewSchema = mongoose.Schema({
    comment:{
        type:String,
        required:true
    },rating:{
        type:Number,
        min:0,
        max:5,
        required: true
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Product'
    },
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
},{ timestamps: true });

module.exports = mongoose.model('Review',ReviewSchema);