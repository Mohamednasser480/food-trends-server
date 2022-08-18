const express = require("express");
const auth = require("../middleware/auth");
const vendorAuth = require("../middleware/vendorRole");
const productController = require("../controllers/vendor");
const Router = express.Router();
const multer = require("multer");

const fileStorage = multer.memoryStorage();

const multerUploads = multer({ fileStorage }).array("images", 4);

// get all vendor orders
Router.get("/orders/", [auth, vendorAuth], productController.getAllOrders);
//get all vendor products
Router.get("/:id", productController.getAllProducts);

// add product
Router.post(
  "/",
  [auth, vendorAuth, multerUploads],
  productController.addProduct
);

// delete product
Router.delete("/:id", [auth, vendorAuth], productController.deleteProduct);
// update product
Router.patch(
  "/:id",
  [auth, vendorAuth, multerUploads],
  productController.updateProduct
);

module.exports = Router;
