const {postComment, replyToComment } = require("../controller/commentController");
const {createLike} = require("../controller/likeController");
const {authRequest} = require("../middleware/authRequest");
const express = require("express");
const router = express.Router();

router.post("/comment",authRequest,postComment);
router.post("/replyComment",authRequest,replyToComment);
router.post("/like",authRequest,createLike);

module.exports = router;