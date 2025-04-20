const validator = require("validator");

const validateUser = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Please enter the valid name");
  } else if (password.length < 1) {
    throw new Error("Please enter the password");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please Enter a strong Password");
  } else if (!email) {
    throw new Error("Please enter the Email");
  } else if (!validator.isEmail(email)) {
    throw new Error("Please enter the valid email");
  }
};

module.exports = { validateUser };
