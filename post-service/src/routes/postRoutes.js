const logger = require('../utils/logger');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest:'uploads/'});
const {createPost,deletePost} = require('../controllers/postControllers');
const {authRequest} = require("../middlewares/authRequest")

router.use(authRequest);

router.post('/',upload.single('postImage'),createPost);
router.post('/:postId/delete',deletePost);


module.exports = router;