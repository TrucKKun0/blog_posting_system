const express = require('express');
const router = express.Router();
const {authRequest} = require('../middlewares/authRequest');
const {followUser, unFollowUser} = require('../controllers/followController');

router.get('/follow/:userId',authRequest,followUser);
router.delete('/unfollow/:userId',authRequest,unFollowUser);


module.exports = router;