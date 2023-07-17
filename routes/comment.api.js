const express = require("express");
const authentication = require("../middlewares/authentication");
const validators = require("../middlewares/validators");
const commentController = require("../controllers/comment.controller");
const router = express.Router();
const { body, param } = require("express-validator");
const postController = require("../controllers/post.controller");

/**
 * @route POST /comments
 * @description create a new comment
 * @body { content, postId }
 * @access Login required
 */
router.post(
  "/",
  authentication.loginRequired,
  validators.validate([
    body("content", "Missing content").exists().notEmpty(),
    body("postId", "Missing postId")
      .exists()
      .isString()
      .custom(validators.checkObjectJd)
  ]),
  commentController.createNewComment
);

/**
 * @route GET /comments/:id
 * @description Get details of a comment
 * @access Login require
 */

/**
 * @route PUT /commnents/:id
 * @description Update a comment
 * @body { content }
 * @access Login required
 */
router.put(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectJd),
    body("content", "Missing content").exists().notEmpty()
  ]),
  commentController.updateSingleComment
);

/**
 * @route DELETE /commnents/:id
 * @description Delete a comment
 * @access Login required
 */
router.delete(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectJd)
  ]),
  commentController.deleteSingleComment
);

module.exports = router;
