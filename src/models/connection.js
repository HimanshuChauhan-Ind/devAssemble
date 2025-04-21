const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "intetrested", "accepted", "rejected"],
        message: `{VALUE} is not supported`,
      },
    },
  },
  { timestamps: true }
);

connectionSchema.pre("save", function () {
  const ConnectionRequest = this;
  if (ConnectionRequest.fromUserId.equals(ConnectionRequest.toUserId)) {
    throw new Error("Connecting to yourself?");
  }
});

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionSchema);

module.exports = ConnectionRequest;
