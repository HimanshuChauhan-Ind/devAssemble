const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEdit } = require("../utils/validation");

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
    res.status(400).send("ERROR: " + err);
  }
});

module.exports = profileRouter;
