const { replyToComment } = require("../controller/commentController");
const {AuthRequest} = require("../middleware/authRequest");
const express = require("express");
const router = express.Router();

router.post("/post/:postId/comment",AuthRequest,postComment);
router.post("/comment/:commentId/reply",AuthRequest,replyToComment);

module.exports = router;