const express = require('express');
const Order = express.Router();
const orderModel = require('../models/Order');
const jwt = require('jsonwebtoken');

Order.get('/', (req, res) => {
  res.send('Get All Customers Data !!');
});

Order.post('/', async (req, res) => {
  try {
    const savedOrder = new orderModel(req.body);
    await savedOrder.save();
    res.status(200).send(savedOrder);
  } catch (err) {
    res.send(err);
  }
});

Order.get('/', async (req, res) => {
  try {
    const users = await orderModel.find({}); //to be populated if wanted
    res.status(200).send(users);
  } catch (err) {
    res.status(400).send(err);
  }
});

// get user by id

Order.get('/:id', async (req, res) => {
  try {
    const users = await orderModel.find({ _id: req.params.id }); //to be populated if wanted
    res.status(200).send(users);
  } catch (err) {
    res.status(400).send(err);
  }
});

// delete order by id

Order.delete('/:id', async (req, res) => {
  try {
    const result = await orderModel.deleteOne({ _id: req.params.id });
    res.status(200).send(result);
  } catch (err) {
    res.send();
  }
});

// update order by id

Order.put('/:id', async (req, res) => {
  try {
    const result = await orderModel.updateOne({ _id: req.params.id }, req.body);
    res.status(200).send(result);
  } catch (err) {
    res.status(200).send(err);
  }
});

module.exports = Order;
