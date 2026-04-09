const express = require('express');
const router = express.Router();
const authRequest = require('../middlewares/authRequest');
const { getFeed } = require('../controller/feedController');

router.get("/",authRequest,getFeed);

module.exports = router;