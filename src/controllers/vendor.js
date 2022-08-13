const productModel = require("../models/product");
const orderModel = require("../models/Order");

// Add a Product
const addProduct = async (req, res) => {
  try {
    const images = req.files.map((file) => {
      return file.path;
    });
    const savedProduct = new productModel({
      ...req.body,
      images,
      vendor: req.user._id,
    });
    await savedProduct.save();
    res.status(201).send(savedProduct);
  } catch (e) {
    res.status(400).send({error:e.message,code:400});
  }
};

// Delete a Product
const deleteProduct = async (req, res) => {
  try {
    const product = await productModel.findOneAndDelete({
      _id: req.params.id,
      vendor: req.user._id,
    });
    if (!product) return res.status(404).send({error:'product not found',code:404});
    res.send(product);
  } catch (e) {
    res.status(400).send({error:e.message,code:400});
  }
};
// Update a Product
const updateProduct = async (req, res) => {
  const images = req.files.map((file) => {
    return file.path;
  });
  const updates = Object.keys(req.body);
  updates.push(req.files[0].fieldname);
  const allowedUpdates = [
    "productName",
    "summary",
    "description",
    "category",
    "images",
    "price",
    "inStock",
    "discount",
    "weight",
  ];

  const isValidUpdate = updates.every((update) => {
    if (allowedUpdates.includes(update)) return true;
    return false;
  });
  if (!isValidUpdate) return res.status(400).send({ error: "Invalid updates",code:400});
  try {
    // Add images to the body
    req.body["images"] = images;

    const updatedProduct = await productModel.findOneAndUpdate(
      { _id: req.params.id, vendor: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) return res.status(404).send({error:'product not found',code:404});
    updates.forEach((update) => (updatedProduct[update] = req.body[update]));
    await updatedProduct.save();
    res.send(updatedProduct);
  } catch (e) {
    res.status(400).send({error:e.message,code:400});
  }
};
// Get All Products
const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find({ vendor: req.params.id });
    if (!products) res.status(404).send({error:'product not found',code:400});
    res.send(products);
  } catch (e) {
    res.status(400).send({error:e.message,code:400});
  }
};
// Get All Orders that are ordered by customers
const getAllOrders = async (req, res) => {
  try {
    let sort = {};
    if (req.query.sortBy) {
      const partsOfSort = req.query.sortBy.split(":");
      sort[partsOfSort[0]] = partsOfSort[1] === "desc" ? -1 : 1;
    } else sort = { createdAt: -1 };
    const filterObj = {};
    if (req.query.status) filterObj.status = req.query.status;

    const vendorProducts = await productModel.find({ vendor: req.user._id });
    const allOrders = await orderModel
      .find(
        {
          products: { $elemMatch: { product: { $in: vendorProducts } } },
          ...filterObj,
        },
        {
          "products.$": 1,
          totalPrice: 1,
          status: 1,
          customer: 1,
          createdAt: 1,
        },
        { sort }
      )
      .populate("products.product")
      .populate("customer");
    if (!allOrders) return res.status(404).send({error:'orders not found',code:404});
    res.send(allOrders);
  } catch (e) {
    res.status(400).send({error:e.message,code:400});
  }
};
module.exports = {
  addProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,
  getAllOrders,
};
