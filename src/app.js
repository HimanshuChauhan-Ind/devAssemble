const express = require("express");
const connectDB = require("./utils/database");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());

const auth = require("./routes/auth");
const profile = require("./routes/profile");
const request = require("./routes/request");

app.use("/", auth);
app.use("/", profile);
app.use("/", request);

connectDB()
  .then(() => {
    console.log("Connected to Database.....");
    app.listen(3000, () => console.log("Server is reunning on port 3000"));
  })
  .catch((err) => {
    console.log("Error connecting to databse", err);
  });
