const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");
const { body, param } = require("express-validator");
const validators = require("../middlewares/validators");
const friendController = require("../controllers/friend.controller");

/**
 * @route GET /friends/requests/requestss
 * @description Send a friend request
 * @body { to: User ID }
 * @access Login required
 */
router.post(
  "/requests",
  authentication.loginRequired,
  validators.validate([
    body("to").exists().isString().custom(validators.checkObjectJd)
  ]),
  friendController.sendFriendRequest
);

/**
 * @route GET /friends/requests/incoming
 * @description Get the list of received pending requests
 * @access Login required
 */
router.get(
  "/requests/incoming",
  authentication.loginRequired,
  friendController.getReceivedFriendRequestList
);

/**
 * @route GET /friends/requests/outgoing
 * @description Get the list of received pending requests
 * @access Login required
 */
router.get(
  "/requests/outgoing",
  authentication.loginRequired,
  friendController.getSentFriendRequestList
);

/**
 * @route GET /friends
 * @description Get the list of friends
 * @access Login required
 */
router.get("/", authentication.loginRequired, friendController.getFriendList);

/**
 * @route PUT /friends/requests/:userId
 * @description Accept/Reject a received pending requests
 * @body { status 'accepted' or 'declined' }
 * @access Login required
 */
router.put(
  "/requests/:userId",
  authentication.loginRequired,
  validators.validate([
    param("userId").exists().isString().custom(validators.checkObjectJd),
    body("status").exists().isString().isIn(["accepted", "declined"])
  ]),
  friendController.reactFriendRequest
);

/**
 * @route DELETE /friends/requests/:userId
 * @description Cancel a friend request
 * @access Login required
 */
router.delete(
  "/requests/:userId",
  authentication.loginRequired,
  validators.validate([
    param("userId").exists().isString().custom(validators.checkObjectJd)
  ]),
  friendController.cancelFriendRequest
);

/**
 * @route PUT /friends/:userId
 * @description Remove a friend
 * @access Login required
 */
router.delete(
  "/:userId",
  authentication.loginRequired,
  validators.validate([
    param("userId").exists().isString().custom(validators.checkObjectJd)
  ]),
  friendController.removeFriend
);

module.exports = router;
