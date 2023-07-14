const express = require("express");
const router = express.Router();

/**
 * @route GET /comments/:id
 * @description Get details of a comment
 * @access Login require
 */

/**
 * @route POST /comments
 * @description create a new comment
 * @body { content, postId }
 * @access Login required
 * /

/**
 * @route PUT /commnents/:id
 * @description Update a comment
 * @access Login required
 * /

/**
 * @route DELETE /commnents/:id
 * @description Delete a comment
 * @access Login required
 * /

/**
 * @route GET /posts/:id
 * @description Get a single post
 * @access Login required
 * /

/**
 * @route GET /posts/:id/comment
 * @description Get comments of a post
 * @body { content, postId }
 * @access Login required
 */

module.exports = router;
