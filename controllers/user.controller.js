const User = require("../models/User");

const userController = {};

userController.register = async (req, res, next) => {
  res.send("User Registration");
};

module.exports = userController;
