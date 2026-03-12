const {postComment, replyToComment } = require("../controller/commentController");
const {createLike} = require("../controller/likeController");
const {AuthRequest} = require("../middleware/authRequest");
const express = require("express");
const router = express.Router();

router.post("/comment",AuthRequest,postComment);
router.post("/replyComment",AuthRequest,replyToComment);
router.post("/like",AuthRequest,createLike);

module.exports = router;