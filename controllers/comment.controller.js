const Comment = require("../models/Comment");
const Post = require("../models/Post");
const { sendResponse, catchAsync, AppError } = require("../helpers/utils");

const commentController = {};

const calculateCommentCount = async (postId) => {
  const commentCount = await Comment.countDocuments({
    post: postId,
    isDeleted: false
  });
  await Post.findByIdAndUpdate(postId, { commentCount: commentCount });
};

commentController.createNewComment = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const { content, postId } = req.body;

  //Check post exists
  const post = Post.findById(postId);
  if (!post)
    throw new AppError(400, "Post not found", "Create new comment error");

  // Create new comment
  let comment = await Comment.create({
    author: currentUserId,
    post: postId,
    content
  });

  //Update commentCount of the post
  await calculateCommentCount(postId);
  comment = await comment.populate("author");

  // Response
  return sendResponse(res, 200, true, comment, "Create new comment successful");
});

commentController.updateSingleComment = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const commentId = req.params.id;
  const { content } = req.body;

  const comment = await Comment.findOneAndUpdate(
    { _id: commentId, author: currentUserId },
    { content },
    { new: true }
  );

  if (!comment)
    throw new AppError(
      400,
      "Comment not found or User not authorized",
      "Update Comment Error"
    );
  // Response
  return sendResponse(res, 200, true, comment, "Update comment successful");
});

commentController.deleteSingleComment = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const commentId = req.params.id;

  const comment = await Comment.findOneAndDelete({
    _id: commentId,
    author: currentUserId
  });

  if (!comment)
    throw new AppError(
      400,
      "Comment not found or User not authorized",
      "Delete Comment Error"
    );
  await calculateCommentCount(comment.post);

  // Response
  return sendResponse(res, 200, true, comment, "Delete comment successful");
});
module.exports = commentController;
