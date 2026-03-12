const express = require('express');
const router = express.Router();
const {authRequest} = require('../middlewares/authRequest');
const {followUser, unFollowUser} = require('../controllers/followController');

router.post('/follow/:userId',authRequest,followUser);
router.post('/unfollow/:userId',authRequest,unFollowUser);


module.exports = router;