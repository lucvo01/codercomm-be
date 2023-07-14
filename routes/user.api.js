const express = require("express");
const router = express.Router();
const userController = require("..//controllers/user.controller");
const { body } = require("express-validator");
const validators = require("../middlewares/validators");
/**
 * @route POST /users
 * @description Register new user
 * @body {name, email, password}
 * @access Public
 */
router.post(
  "/",
  validators.validate([
    body("name", "Invalid name").exists().notEmpty(),
    body("email", "Invalid email")
      .exists()
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false }),
    body("password", "Invalid password").exists().notEmpty()
  ]),
  userController.register
);

/**
 * @route GET /users?page=1&limit=10
 * @description Get user with pagin
 * @access Login required
 */

/**
 * @route GET /users/me
 * @description Get current user info
 * @access Login required
 */

/**
 * @route GET /users/:id
 * @description Get a user profile
 * @access Login required
 */

/**
 * @route PUT /users/:id
 * @description Update user profile
 * @body { name, avatarUrl, coverUrl, aboutMe, city, country, company, jobTitle, facebookLink, instagramLink, linkedinLink, twitterLink }
 * @access Login required
 */

module.exports = router;
