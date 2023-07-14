const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const User = require("../models/User");
const bcrypt = require ("bcryptjs")

const userController = {};

userController.register = catchAsync(async (req, res, next) => {

    // Get data from request
    let { name, email, password } = req.body;
    // Business Logisc Validation
    let user = await User.findOne({ email });
   if(user) throw new AppError(400, "User already exists", "Registration Error")

    // Process data
    const salt = await bcrypt.genSalt(10)
    password = await bcrypt.hash(password, salt)
    user = await User.create({name, email, password})
  const accessToken = await user.generateToken();

    // Response
    sendResponse(
      res,
      200,
      true,
      { user, accessToken },
      null,
      "Create User successful"
    );
  
}) 

userController.getUsers = catchAsync(async (req, res, next) => {
  // Get data from request
  
  // Business Logisc Validation


  // Process data


  // Response
  sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Create User successful"
  );
}); 

userController.getCurrentUser = catchAsync(async (req, res, next) => {
  // Get data from request

  // Business Logisc Validation

  // Process data

  // Response
  sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Create User successful"
  );
}); 

userController.getSingleUser = catchAsync(async (req, res, next) => {
  // Get data from request

  // Business Logisc Validation

  // Process data

  // Response
  sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Create User successful"
  );
}); 

userController.updateProfile = catchAsync(async (req, res, next) => {
  // Get data from request

  // Business Logisc Validation

  // Process data

  // Response
  sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Create User successful"
  );
}); 

module.exports = userController;
