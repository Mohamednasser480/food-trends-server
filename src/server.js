const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const userRoute = require('./routes/user');
const orderRoute = require('./routes/order');
const productRoute = require('./routes/product');
const wishlistRoute = require('./routes/wishlist');
const cartRoute = require('./routes/cart');
const reviewRouter = require('./routes/review');
const vendorRouter = require('./routes/vendor');
const deliveryRouter = require('./routes/delivery');
// Middlewares
const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

// Global Variables
const MONGO_URL = process.env.MONGO_URL || 'localhost:27017';
const API_URI = process.env.API_URI;
const HOST = process.env.HOST || 'localhost';

// Setup express server port from ENV, default: 3000
app.set('port', process.env.PORT || 3000);

// Enable only in development HTTP request logger middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

mongoose
  .connect(MONGO_URL)
  .then(() => console.log('db connected successfully'))
  .catch((err) => console.log(`Database Connection Error: ${err.message}`));

app.use(`${API_URI}/users`, userRoute);
app.use(`${API_URI}/orders`, orderRoute);
app.use(`${API_URI}/products`, productRoute);
app.use(`${API_URI}/reviews`, reviewRouter);
app.use(`${API_URI}/vendor`, vendorRouter);
app.use(`${API_URI}/cart`, cartRoute);
app.use(`${API_URI}/wishlist`, wishlistRoute);
app.use(`${API_URI}/delivery`, deliveryRouter);
app.use(`${API_URI}/images`, express.static(path.join(path.resolve(__dirname, '..'), 'images')));

app.listen(app.get('port'), () => {
  console.log(`Backend server is running on http://${HOST}:${app.get('port')}`);
});
