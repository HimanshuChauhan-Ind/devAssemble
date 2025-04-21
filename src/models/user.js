const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    lastName: {
      type: String,
      minLength: 3,
      maxLength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(email) {
        if (!validator.isEmail(email)) {
          throw new Error("Please Enter a valid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(password) {
        if (!validator.isStrongPassword(password)) {
          throw new Error("Please enter a strong password");
        }
      },
    },
    age: {
      type: Number,
    },
    about: {
      type: String,
      default: "I am a Developer",
    },
    gender: {
      type: String,
      validate(gender) {
        if (!["male", "female", "others"].includes(gender)) {
          throw new Error("Please select the correct gender");
        }
      },
    },
    skills: {
      type: [String],
    },
    photoUrl: {
      type: String,
      validate(url) {
        if (!validator.isURL(url)) {
          throw new Error("Please Enter valid photo URL");
        }
      },
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, "aslkdfjasdlkf");
  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
