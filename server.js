const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoute = require('./routes/user');
const productRoute = require('./routes/product');

const app = express();
app.use(express.json());
dotenv.config();

app.use('/api/v1/users',userRoute);
app.use('/api/v1/products',productRoute);

mongoose.connect(process.env.MONGO_URL)
    .then( ()=> console.log('db connected successfully'))
    .catch( err =>console.log(err));

app.listen(process.env.PORT||3000,()=>{
    console.log('Backend server is running!');
});