const User = require("../models/User");
const { confirmationMail } = require("../emails/account");
const { contactUsMail } = require("../emails/contact");
const utils = require("./utils");
const DatauriParser = require("datauri/parser");
const { cloudinary } = require("../cloudinary/cloudinary");
const path = require("path");

const register = async (req, res) => {
  const user = new User(req.body);
  try {
    if (user.userType === "vendor" && !user.storeName)
      throw new Error("the store name is required !!");
    user.confirmationCode = confirmationMail(user.email);
    if (user.userType === "customer") user.verified = true;
    await user.save();
    res.status(201).send();
  } catch (e) {
    res.status(400).send(e.message);
  }
};
const login = async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(401).send(e.toString());
  }
};
const confirm = async (req, res) => {
  try {
    if (req.body.confirmationCode === req.user.confirmationCode)
      req.user.status = "Active";
    else return res.status(400).send({ msg: "wrong confirmation code" });
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e.message);
  }
};
const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(400).send();
  }
};
const userProfile = async (req, res) => {
  res.send({ user: req.user, token: req.token });
};
const updateUser = async (req, res) => {
  const updates = Object.keys(req.body);
  updates.push("image");
  const allowedUpdates = [
    "name",
    "email",
    "password",
    "age",
    "storeName",
    "address",
    "mobile",
    "image",
  ];

  const isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdate)
    return res.status(400).send({ error: "Invalid updates", code: 400 });
  try {
    const parser = new DatauriParser();

    const fileto64 = (file) => {
      return parser.format(
        path.extname(file.originalname).toString(),
        file.buffer
      );
    };

    const file64 = fileto64(req.file).content;

    const uploadResponse = await cloudinary.uploader.upload(file64, {
      upload_preset: "ml_default",
    });

    req.body["image"] = uploadResponse.url;

    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send({ error: e.message, code: 400 });
  }
};
const deleteUser = async (req, res) => {
  try {
    req.user.available = false;
    req.user.email += `.${req.user._id}.deleted`;
    await req.user.save();

    if (req.user.userType === "customer")
      await utils.deleteCustomer(req.user._id);
    else if (req.user.userType === "vendor")
      await utils.deleteVendor(req.user._id);
    else if (req.user.userType === "delivery")
      await utils.deleteDelivery(req.user._id);

    res.send();
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message, code: 400 });
  }
};
const contactUs = async (req, res) => {
  try {
    await contactUsMail(req.body.email, req.body.message, req.body.name);
    res.send();
  } catch (e) {
    res.status(400).send({ error: e.message, code: 400 });
  }
};
module.exports = {
  register,
  login,
  confirm,
  logout,
  userProfile,
  updateUser,
  deleteUser,
  contactUs,
};
