const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose.connect(
    "mongodb+srv://himcha:q1zHVRz8Ha6M5Cel@cluster0.qeqskgn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/devAssemble"
  );
};

module.exports = connectDB;
