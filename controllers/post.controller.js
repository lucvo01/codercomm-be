const { sendResponse, catchAsync, AppError } = require("../helpers/utils");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const User = require("../models/User");
const Friend = require("../models/Friend");
// const { post } = require("../routes/comment.api");

const postController = {};

const calculatePostCount = async (userId) => {
  const postCount = await Post.countDocuments({
    author: userId,
    isDeleted: false
  });
  await User.findByIdAndUpdate(userId, { postCount });
};

postController.createNewPost = catchAsync(async (req, res, next) => {
  // Get data from request
  const currentUserId = req.userId;
  const { content, image } = req.body;
  // Business Logisc Validation
  let post = await Post.create({ content, image, author: currentUserId });

  await calculatePostCount(currentUserId);

  post = await post.populate("author");

  // Response
  return sendResponse(res, 200, true, post, "Create new post successful");
});

postController.updateSinglePost = catchAsync(async (req, res, next) => {
  // Get data from request
  const currentUserId = req.userId;
  const postId = req.params.id;

  // Business Logisc Validation
  let post = await Post.findById(postId);
  if (!post) throw new AppError(400, "Post not found", "Update post error");
  if (!post.author.equals(currentUserId))
    throw new AppError(400, "Only author can edit post", "Update Post Error");

  // Process data
  const allows = ["content", "image"];

  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      post[field] = req.body[field];
      post.save();
    }
  });

  // Response
  return sendResponse(res, 200, true, post, null, "Update post successful");
});

postController.getSinglePost = catchAsync(async (req, res, next) => {
  // Get data from request
  const postId = req.params.id;

  // Business Logic Validation
  let post = await Post.findById(postId);
  if (!post) throw new AppError(400, "Post not found", "Get single post error");

  post = post.toJSON;
  post.comments = await Comment.find({ post: post._id }).populate("author");
  // Response
  return sendResponse(res, 200, true, post, null, "Get single post successful");
});

postController.getPosts = catchAsync(async (req, res, next) => {
  // Get data from request
  const currentUserId = req.userId;
  const userId = req.params.userId;
  let { page, limit, ...filter } = { ...req.query };

  // Business Logisc Validation
  let user = await User.findById(userId);
  if (!user) throw new AppError(400, "User not found", "Get Posts Error");

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  // Process data
  let userFriendIDs = await Friend.find({
    $or: [{ from: userId }, { to: userId }],
    status: "accepted"
  });

  if (userFriendIDs && userFriendIDs.length) {
    userFriendIDs = userFriendIDs.map((friend) => {
      if (friend.from._id.equals(userId)) return friend.to;
      return friend.from;
    });
  } else {
    userFriendIDs = [];
  }
  userFriendIDs = [...userFriendIDs, userId];

  const filterConditions = [
    { isDeleted: false },
    { author: { $in: userFriendIDs } }
  ];
  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};
  console.log("filterCriteria", filterCriteria);
  const count = await Post.countDocuments(filterCriteria);
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  let posts = await Post.find(filterCriteria)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .populate("author");

  // Response
  return sendResponse(res, 200, true, { posts, totalPages, count }, null, "");
});

postController.deleteSinglePost = catchAsync(async (req, res, next) => {
  // Get data from request
  const currentUserId = req.userId;
  const postId = req.params.id;

  // Process data
  const post = await Post.findOneAndUpdate(
    { _id: postId, author: currentUserId },
    { isDeleted: true },
    { new: true }
  );

  if (!post)
    throw new AppError(
      400,
      "Post not found or User not authorized",
      "Delete Post Error"
    );
  await calculatePostCount(currentUserId);

  // Response
  return sendResponse(res, 200, true, post, null, "Delete post successful");
});

postController.getCommentsOfPost = catchAsync(async (req, res, next) => {
  const postId = req.params.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.page) || 10;

  // Validate if post exists
  const post = Post.findById(postId);
  if (!post) throw new AppError(400, "Post not found", "Get comments error");

  // Get comments
  const count = await Comment.countDocuments({ post: postId });
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  const comments = await Comment.find({ post: postId })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .populate("author");

  // Response
  return sendResponse(
    res,
    200,
    true,
    { comments, totalPages, count },
    null,
    "Get comments successful"
  );
});

module.exports = postController;
