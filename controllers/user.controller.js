const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const User = require("../models/User");
const Friend = require("../models/Friend");
const bcrypt = require("bcryptjs");

const userController = {};

userController.register = catchAsync(async (req, res, next) => {
  // Get data from request
  let { name, email, password } = req.body;
  // Business Logisc Validation
  let user = await User.findOne({ email });
  if (user)
    throw new AppError(400, "User already exists", "Registration Error");

  // Process data
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  user = await User.create({ name, email, password });
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
});

userController.getUsers = catchAsync(async (req, res, next) => {
  // Get data from request
  const currentUserId = req.userId;
  let { page, limit, ...filter } = { ...req.query };
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  // Business Logic Validation
  // Process data
  const filterConditions = [{ isDeleted: false }];

  if (filter.name) {
    filterConditions.push({
      name: { $regex: filter.name, $option: "i" }
    });
  }

  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  const count = await User.countDocuments(filterCriteria);
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  let users = await User.find(filterCriteria)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);

  const promises = users.map(async (user) => {
    let temp = user.toJSON();
    temp.friendship = await Friend.findOne({
      $or: [
        { from: currentUserId, to: user._id },
        { from: user._id, to: currentUserId }
      ]
    });
    return temp;
  });
  const userWithFriendship = await Promise.all(promises);

  // Response
  return sendResponse(
    res,
    200,
    true,
    { users, totalPages, count },
    null,
    "Create User successful"
  );
});

userController.getCurrentUser = catchAsync(async (req, res, next) => {
  // Get data from request
  const currentUserId = req.userId;
  // Business Logisc Validation
  const user = await User.findById(currentUserId);
  if (!user)
    throw new AppError(400, "User not found", "Get current user error");
  // Process data

  // Response
  sendResponse(res, 200, true, user, null, "Get current user successful");
});

userController.getSingleUser = catchAsync(async (req, res, next) => {
  // Get data from request
  const currentUserId = req.userId;
  const userId = req.params.id;

  // Business Logisc Validation
  let user = await User.findById(userId);
  if (!user) throw new AppError(400, "User not found", "Get single user error");

  // Process data
  user = user.toJSON;
  user.friendship = await Friend.findOne({
    $or: [
      { from: currentUserId, to: user._id },
      { from: user._id, to: currentUserId }
    ]
  });
  // Response
  return sendResponse(res, 200, true, user, null, "Get single user successful");
});

userController.updateProfile = catchAsync(async (req, res, next) => {
  // Get data from request
  const currentUserId = req.userId;
  const userId = req.params.id;

  // Business Logisc Validation
  if (currentUserId !== userId)
    throw new AppError(400, "Permission required", "Update user error");
  let user = await User.findById(userId);
  if (!user) throw new AppError(400, "User not found", "Update user error");

  // Process data
  const allows = [
    "name",
    "avatarUrl",
    "coverUrl",
    "aboutMe",
    "city",
    "country",
    "company",
    "jobTitle",
    "facebookLink",
    "instagramLink",
    "linkedinLink",
    "twitterLink"
  ];

  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
      user.save();
    }
  });

  // Response
  return sendResponse(res, 200, true, user, null, "Update User successful");
});

module.exports = userController;
