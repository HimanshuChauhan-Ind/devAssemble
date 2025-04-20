const express = require("express");
const connectDB = require("./utils/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signUp", async (req, res) => {
  const user = new User(req.body);

  try {
    if (user.skills.length > 10) {
      throw new Error("You can add upto 10 skills");
    }

    await user.save();

    res.send("User added successfully");
  } catch (err) {
    console.log("Unable to add user: " + err);
  }
});

app.get("/userbyemail", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    console.log("Unable to find user", err);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      res.status(404).send("No users found");
    } else {
      res.send(users);
    }
  } catch (err) {
    console.log("Unable to find users", err);
  }
});

app.patch("/updateUser/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = ["firstName", "lastName", "about", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Some field updates are not allowed");
    }

    if (data.skills && data.skills.length > 10) {
      throw new Error("You can only add upto 10 skills");
    }

    await User.findByIdAndUpdate(userId, data);
    res.send("User updated successfully");
  } catch (err) {
    res.send("Unable to update user" + err);
  }
});

app.delete("/removeUser", async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findByIdAndDelete(userId);
    res.send("User Delted Successfully");
  } catch (err) {
    console.log("Unable to delete the user", err);
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
