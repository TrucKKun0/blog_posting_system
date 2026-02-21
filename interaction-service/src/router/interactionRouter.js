const {AuthRequest} = require("../middleware/authRequest");
const express = require("express");
const router = express.Router();

router.post("/post/:postId/comment",AuthRequest,postComment);