const express = require("express");
const auth = require("../middleware/auth");
const userController = require("../controllers/user");
const Router = express.Router();
const multer = require("multer");

const fileStorage = multer.memoryStorage();

const multerUploads = multer({ fileStorage }).single("image");

Router.post("/register", userController.register);
Router.post("/login", userController.login);
Router.post("/confirm", auth, userController.confirm);
Router.post("/logout", auth, userController.logout);
Router.get("/", auth, userController.userProfile);
Router.patch("/", [auth, multerUploads], userController.updateUser);
Router.delete("/", auth, userController.deleteUser);
Router.post("/contact", auth, userController.contactUs);

module.exports = Router;
