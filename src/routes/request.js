const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connection");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUser = req.user;
      const { status, toUserId } = req.params;

      const VALID_STATUS = ["ignored", "intetrested"];
      if (!VALID_STATUS.includes(status)) {
        throw new Error("Invalid Request");
      }

      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId: fromUser._id, toUserId },
          { fromUserId: toUserId, toUserId: fromUser._id },
        ],
      });
      if (existingRequest) {
        return res
          .status(404)
          .json({ message: "Connection request already exosts!" });
      }

      const newConneciton = new ConnectionRequest({
        fromUserId: fromUser._id,
        toUserId,
        status,
      });
      await newConneciton.save();
      res.json({ message: status });
    } catch (err) {
      res.status(404).send("Unable to send the request: " + err.message);
    }
  }
);

module.exports = requestRouter;
