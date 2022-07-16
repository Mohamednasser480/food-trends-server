const express = require('express');
const user = express.Router();

user.get('/',(req,res)=>{
    res.send('Get All Customers Data !!');
});

module.exports = user;