const express = require('express');
const Wishlist = express.Router();
const WishlistModel = require('../models/Wishlist');
const jwt = require('jsonwebtoken');

Wishlist.get('/', (req, res) => {
    res.send('horaaaaaa');
  });

Wishlist.post('/', async (req, res) => {
  try {
    console.log("horaaaaa")
    const savedwishlist = new WishlistModel(req.body);
    await savedwishlist.save();
    res.status(200).send(savedOrder);
  } catch (err) {
    res.send(err);
  }
});

Wishlist.get('/', async (req, res) => {
  try {
    const wishlist = await WishlistModel.find({}); //to be populated if wanted
    res.status(200).send(wishlist);
  } catch (err) {
    res.status(400).send(err);
  }
});

// get user by id

Wishlist.get('/:id', async (req, res) => {
  try {
    const wishlist = await WishlistModel.find({ _id: req.params.id }); //to be populated if wanted
    res.status(200).send(wishlist);
  } catch (err) {
    res.status(400).send(err);
  }
});

// delete order by id

Wishlist.delete('/:id', async (req, res) => {
  try {
    const result = await WishlistModel.deleteOne({ _id: req.params.id });
    res.status(200).send(result);
  } catch (err) {
    res.send();
  }
});

// update order by id

Wishlist.put('/:id', async (req, res) => {
  try {
    const result = await WishlistModel.updateOne({ _id: req.params.id }, req.body);
    res.status(200).send(result);
  } catch (err) {
    res.status(200).send(err);
  }
});

module.exports = Wishlist;
