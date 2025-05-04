const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEdit } = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.status(400).send("ERROR: " + err);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEdit(req)) {
      throw new Error("Some fileds are not allowed for update");
    }

    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.send("Saved!!");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const verifyOldPassword = await bcrypt.compare(
      oldPassword,
      req.user.password
    );
    if (!verifyOldPassword) {
      throw new Error("Do you remember the old password?");
    }

    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("Password is not strong!!Try Again");
    }
    const newPassowrdHash = await bcrypt.hash(newPassword, 10);

    const loggedInUser = req.user;
    loggedInUser.password = newPassowrdHash;

    await loggedInUser.save();

    res.send("Password Update Successfully!!");
  } catch (err) {
    res.status(400).send("ERROR: " + err);
  }
});
module.exports = profileRouter;
