const express = require("express");
const router = express.Router();

/**
 * @route GET /friends/requests/requestss
 * @description Send a friend request
 * @body { to: User ID }
 * @access Login required
 */

/**
 * @route GET /friends/requests/incoming
 * @description Get the list of received pending requests
 * @access Login required
 */

/**
 * @route GET /friends/requests/outgoing
 * @description Get the list of received pending requests
 * @access Login required
 */

/**
 * @route GET /friends
 * @description Get the list of friends
 * @access Login required
 */

/**
 * @route PUT /friends/requests/:userId
 * @description Accept/Reject a received pending requests
 * @body { status 'accepted' or 'declined' }
 * @access Login required
 */

module.exports = router;
