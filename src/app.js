const express = require("express");
const connectDB = require("./utils/database");
const User = require("./models/user");
const validator = require("validator");
const { validateUser } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signUp", async (req, res) => {
  try {
    validateUser(req);
    const { firstName, lastName, email, password } = req.body;

    const userPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: userPassword,
    });
    await user.save();

    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Unable to add user: " + err);
  }
});

app.post("/signIn", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      throw new Error("Please enter a valid Email");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isValidUser = await bcrypt.compare(password, user.password);
    if (isValidUser) {
      const token = jwt.sign({ _id: user._id }, "aslkdfjasdlkf");
      res.cookie("token", token);
      res.send("Welcome back!!");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.status(400).send("ERROR: " + err);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    console.log("Send the request");
    res.send("Request sent by: " + req.user.firstName);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

app.use("/", (req, res, err) => {
  if (err) {
    res.send("Something went Wrong: " + err.message);
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
