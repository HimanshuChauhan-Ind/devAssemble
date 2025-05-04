const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connection");
const User = require("../models/user");
const userRouter = express.Router();

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const request = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "intetrested",
    }).populate("fromUserId", "firstName lastName");

    res.json({ message: "Got all the reqests!", request });
  } catch (error) {
    throw new Error("ERROR: " + error.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const request = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", "firstName lastName")
      .populate("toUserId", "firstName lastName");
    const data = request.map((value) => {
      if (value.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return value.toUserId;
      }
      return value.fromUserId;
    });
    res.json({
      data,
    });
  } catch (err) {
    return res.status(400).json({ err });
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 100 ? 100 : limit;
    const skip = (page - 1) * limit;
    const connectionRequestSent = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsers = new Set();
    connectionRequestSent.forEach((req) => {
      hideUsers.add(req.fromUserId.toString());
      hideUsers.add(req.toUserId.toString());
    });

    const feed = await User.find({
      _id: { $nin: Array.from(hideUsers) },
    })
      .select("firstName lastName age skills photoUrl about")
      .skip(skip)
      .limit(limit);

    res.json({ feed });
  } catch (err) {
    res.status(400).json({ ERROR: err });
  }
});

module.exports = userRouter;
