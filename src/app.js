const express = require("express");
const connectDB = require("./utils/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signUp", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();

    res.send("User added successfully");
  } catch (err) {
    console.log("Unable to add user", err);
  }
});

connectDB()
  .then(() => {
    console.log("Connected to Database.....");
    app.listen(3000, () => console.log("Server is reunning on port 3000"));
  })
  .catch((err) => {
    console.log("Error connecting to databse", err);
  });
