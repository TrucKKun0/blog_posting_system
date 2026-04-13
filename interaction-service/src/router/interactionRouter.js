const {postComment, replyToComment, deleteComment,getComments,getAllComments} = require("../controller/commentController");
const {createLike, getLikedPosts} = require("../controller/likeController");
const {authRequest} = require("../middleware/authRequest");
const express = require("express");
const router = express.Router();

router.post("/comment",authRequest,postComment);
router.post("/replyComment",authRequest,replyToComment);
router.post("/like",authRequest,createLike);
router.get("/liked-posts",authRequest,getLikedPosts);
router.post("/deleteComment",authRequest,deleteComment);
router.get("/getComments",authRequest,getComments);
router.get("/comments/all",authRequest,getAllComments);

module.exports = router;