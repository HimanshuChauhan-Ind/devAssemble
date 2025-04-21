const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { validateUser } = require("../utils/validation");

const authRouter = express.Router();

authRouter.post("/signUp", async (req, res) => {
  try {
    validateUser(req);
    const { firstName, lastName, email, password } = req.body;

    const userPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: userPassword,
    });
    await user.save();

    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Unable to add user: " + err);
  }
});

authRouter.post("/signIn", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      throw new Error("Please enter a valid Email");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isValidUser = await bcrypt.compare(password, user.password);
    if (isValidUser) {
      const token = user.getJWT();
      res.cookie("token", token);
      res.send("Welcome back!!");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err);
  }
});

module.exports = authRouter;
