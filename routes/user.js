const express = require('express');
const User = express.Router();
const userModel = require('../models/user');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

User.get('/', (req, res) => {
  res.send('Get All Customers Data !!');
});

User.post('/register', async (req, res) => {
  try {
    const { password, ...otherData } = req.body;
    const newUser = new userModel({
      ...otherData,
      password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
    });
    console.log(newUser);
    const savedUser = await newUser.save();
    res.send(savedUser);
  } catch (err) {
    res.send(err);
  }
});

User.get('/', async (req, res) => {
  try {
    const users = await userModel.find({}); //to be populated if wanted
    res.status(200).send(users);
  } catch (err) {
    res.status(400).send(err);
  }
});

// get user by id

User.get('/:id', async (req, res) => {
  try {
    const users = await userModel.find({ _id: req.params.id }); //to be populated if wanted
    res.status(200).send(users);
  } catch (err) {
    res.status(400).send(err);
  }
});

// delete user by id

User.delete('/:id', async (req, res) => {
  try {
    const result = await userModel.deleteOne({ _id: req.params.id });
    res.status(200).send(result);
  } catch (err) {
    res.send();
  }
});

// update user by id 

User.put('/:id', async (req, res) => {
  try {
    const result = await userModel.updateOne({ _id: req.params.id }, req.body);
    res.status(200).send(result);
  } catch (err) {
    res.status(200).send(err);
  }
});

module.exports = User;
