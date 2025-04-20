const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("There is no Token!");
    }

    const userInfo = await jwt.verify(token, "aslkdfjasdlkf");

    const user = await User.findById(userInfo._id);
    if (!user) {
      throw new Error("There is no such user!!");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = { userAuth };
