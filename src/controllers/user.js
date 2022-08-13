const User = require("../models/User");
const { confirmationMail } = require("../emails/account");
const { contactUsMail } = require("../emails/contact");
const register = async (req, res) => {
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
}
const login = async (req, res) => {
    try {
        const user = await User.findByCredentials(
            req.body.email,
            req.body.password
        );
        const token = await user.generateAuthToken();
        res.send({user, token});
    } catch (e) {
        res.status(400).send(e.toString());
    }
}
const confirm =  async (req, res) => {
    try {
        if (req.body.confirmationCode === req.user.confirmationCode)
            req.user.status = "Active";
        else return res.status(400).send({ msg: "wrong confirmation code" });
        await req.user.save();
        res.send(req.user);
    } catch (e) {
        res.status(400).send(e.message);
    }
}
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
}
const userProfile = async (req, res) => {
    res.send({ user: req.user, token: req.token });
}
const updateUser = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password","age","storeName","address","mobile","image"];
    const isValidUpdate = updates.every((update) =>
        allowedUpdates.includes(update)
    );

    if (!isValidUpdate)
        return res.status(400).send({ error: "Invalid updates",code:400});
    try {
        updates.forEach((update) => (req.user[update] = req.body[update]));
        await req.user.save();
        res.send(req.user);
    } catch (e) {
        res.status(400).send({error:e.message,code:400});
    }
}
const deleteUser = async (req, res) => {
    try {
        await req.user.remove();
        res.send();
    } catch (e) {
        res.status(400).send({error:e.message,code:400});
    }
}
const contactUs = async (req, res) => {
    try {
        await contactUsMail(req.body.email, req.body.message, req.body.name);
        res.send();
    } catch (e) {
        res.status(400).send({error:e.message,code:400});
    }
}
module.exports = {
    register,
    login,
    confirm,
    logout,
    userProfile,
    updateUser,
    deleteUser,
    contactUs
}
