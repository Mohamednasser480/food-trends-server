const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");
const { confirmationMail } = require("../emails/account");
const { contactUsMail } = require("../emails/contact");
const router = express.Router();

router.post("/register", async (req, res) => {
  const user = new User(req.body);
  try {
    if (user.userType === "vendor" && !user.storeName)
      throw new Error("the store name is required !!");
    user.confirmationCode = confirmationMail(user.email);
    await user.save();
    res.status(201).send();
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    if (user.status === "Active") {
      res.send({user, token});
    }else{
      res.send({user, token});
      // throw new Error('Pending Account. Please Verify Your Email!!')
    }
  } catch (e) {
    res.status(400).send(e.toString());
  }
});

router.post("/confirm",auth, async (req, res) => {
  console.log(req)
  try {
    if (req.body.confirmationCode === req.user.confirmationCode)
      req.user.status = "Active";
    else return res.status(400).send({ msg: "wrong confirmation code" });
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    console.log(e)
    res.status(400).send(e.message);
  }
});

router.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/", auth, async (req, res) => {
  res.send({ user: req.user, token: req.token });
});

router.patch("/", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password"];
  const isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdate)
    return res.status(400).send({ error: "Invalid updates!" });
  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});
router.post("/contact", auth, async (req, res) => {
  try {
    await contactUsMail(req.body.email, req.body.message, req.body.name);
    res.send();
  } catch (e) {
    res.status(400).send(e);
  }
});
module.exports = router;
