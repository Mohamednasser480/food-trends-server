const mongoose = require('mongoose');
const ReviewSchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
        lowercase: true
    },
    comment:{
        type:String,
        required:true,
        lowercase: true
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