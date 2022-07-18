const orderModel = require("../models/Order");

export const getAllOrders = (req, res) => {
  res.send('Get All Customers Data !!');
}

export const createOrder = async (req, res) => {
  try {
    const savedOrder = new orderModel(req.body);
    await savedOrder.save();
    res.status(200).send(savedOrder);
  } catch (err) {
    res.send(err);
  }
}

export const getOrder = async (req, res) => {
  try {
    const users = await orderModel.find({ _id: req.params.id }); //to be populated if wanted
    res.status(200).send(users);
  } catch (err) {
    res.status(400).send(err);
  }
}

export const updateOrder = async (req, res) => {
  try {
    const result = await orderModel.updateOne({ _id: req.params.id }, req.body);
    res.status(200).send(result);
  } catch (err) {
    res.status(200).send(err);
  }
}

export const deleteOrder = async (req, res) => {
  try {
    const result = await orderModel.deleteOne({ _id: req.params.id });
    res.status(200).send(result);
  } catch (err) {
    res.send();
  }
}
