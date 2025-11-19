const express = require('express')
const router = express.Router()
const {getUserProfile,updateUserProfile} = require('../controllers/profile-controller')

const logger = require('../utils/logger');

router.get('/user/:userId',getUserProfile);
router.post('/user',updateUserProfile);

module.exports = router;