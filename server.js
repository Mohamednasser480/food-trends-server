const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const userRoute = require('./routes/user');
const orderRoute = require('./routes/order');
const productRoute = require('./routes/product');
const wishlistRoute = require("./routes/wishlist");
const cartRoute = require('./routes/cart');

const app = express();
app.use(cors());
app.options('*', cors());
app.use(express.json());
dotenv.config();


mongoose.connect(process.env.MONGO_URL)
    .then( ()=> console.log('db connected successfully'))
    .catch( err =>console.log(err));


app.use('/api/v1/users', userRoute);
app.use('/api/v1/orders', orderRoute);
app.use('/api/v1/cart', cartRoute);
app.use('/api/v1/products', productRoute);
app.use('/api/v1/wishlist', wishlistRoute);



app.listen(process.env.PORT||3000,()=>{
    console.log('Backend server is running!');
});

