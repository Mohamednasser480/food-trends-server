const express = require("express");
const auth = require("../middleware/auth");
const vendorAuth = require("../middleware/vendorRole");
const productController = require("../controllers/vendor");
const Router = express.Router();
const multer = require("multer");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: fileStorage, fileFilter: fileFilter });

// get all vendor orders
Router.get("/orders/", [auth, vendorAuth], productController.getAllOrders);
//get all vendor products
Router.get("/:id", productController.getAllProducts);

// add product
Router.post(
  "/",
  [auth, vendorAuth, upload.array("images", 4)],
  productController.addProduct
);
// delete product
Router.delete("/:id", [auth, vendorAuth], productController.deleteProduct);
// update product
Router.patch(
  "/:id",
  [auth, vendorAuth, upload.array("images", 4)],
  productController.updateProduct
);

module.exports = Router;
