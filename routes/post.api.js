const express = require("express");
const router = express.Router();

/**
 * @route GET /posts/user/:userId?page=1&limit=10
 * @description Get all posts a user can see with pagination
 * @access Login required
 */

/**
 * @route POST /posts
 * @description Create a new post
 * @body { content, image }
 * @access login required
 */

/**
 * @route PUT /posts/:id
 * @description Update a post
 * @body { content, image }
 * @access login required
 */

/**
 * @route DELETE /posts/:id
 * @description Delete a post
 * @access login required
 */

module.exports = router;
