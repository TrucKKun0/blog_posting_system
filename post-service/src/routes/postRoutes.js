const logger = require('../utils/logger');
const express = require('express');
const router = express.Router();

const {authRequest} = require("../middlewares/authRequest")

router.use(authRequest);

router.post('/',createPost);
router.post('/:postId/delete',deletePost);


module.exports = router;