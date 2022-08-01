const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Product = require('./product');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim:true
    },
    email:{
        type: String,
        required:true,
        unique: true,
        trim:true,
        lowercase:true,
        validate(value) {
            if(!validator.isEmail(value))throw new Error('Email is invalid');
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minLength:6,
        validate(value){
            if(value.toLowerCase().includes('password')) throw new Error('the password should not contain "password" word');
        }
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0) throw new Error('Age must be a positive number');
        }
    },
    userType:{
      type:String,
      default: "customer",
    },
    mobile:{
        type:String,
        required:true
    },image:{
        type:String,
        default:'https://www.4read.net/uploads/authors/1534154564.png'
    },
    address:{
        type:String
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
},{ timestamps: true });
userSchema.virtual('Product',{
   ref:'Product',
   localField:'_id',
    foreignField:'vendor'
});
userSchema.methods.generateAuthToken = async function(){
    const token = await jwt.sign({ _id: this._id.toString() }, process.env.JWT_SEC,{expiresIn: "3d"});
    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
}
userSchema.methods.toJSON = function (){
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
}
userSchema.statics.findByCredentials = async (email,password)=>{
    const user = await User.findOne({ email });
    if(!user) throw new Error('Unable to login');
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) throw new Error('Unable to login');
    return user;
}
// Hash the plain text password before saving
userSchema.pre('save',async function(next){
    if(this.isModified('password'))
        this.password = await bcrypt.hash(this.password,8) ;
    next();
});
// Delete All Vendor Product
userSchema.pre('remove',async function(next){
    await Product.deleteMany({vendor: this._id});
    next();
})
const User = mongoose.model('User',userSchema)

module.exports = User;