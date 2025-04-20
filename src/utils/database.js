const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose.connect(
    "mongodb+srv://himcha:q1zHVRz8Ha6M5Cel@cluster0.qeqskgn.mongodb.net/devAssemble?retryWrites=true&w=majority"
  );
};

module.exports = connectDB;
