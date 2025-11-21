const express = require('express')
const router = express.Router()
const {updateUserProfile} = require('../controller/profile-controller')
const {authRequest} = require('../middlewares/authRequest');

const logger = require('../utils/logger');


router.post('/user',authRequest,updateUserProfile);

module.exports = router;