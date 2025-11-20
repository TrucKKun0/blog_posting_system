const express = require('express')
const router = express.Router()
const {getUserProfile,updateUserProfile} = require('../controller/profile-controller')
const {authRequest} = require('../middlewares/authRequest');

const logger = require('../utils/logger');

router.get('/user/:userId',getUserProfile);
router.post('/user',authRequest,updateUserProfile);

module.exports = router;