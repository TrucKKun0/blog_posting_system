const logger = require('../utils/logger');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const {createPost,deletePost} = require('../controllers/postControllers');
const {authRequest} = require("../middlewares/authRequest")
const upload = multer({storage: multer.memoryStorage(), limits: {fileSize: 5 * 1024 * 1024}}); // 5MB limit

router.use(authRequest);

router.post('/',upload.single('postImage'),createPost);
router.post('/:postId/delete',deletePost);


module.exports = router;