const express = require('express');
const router = express.Router();
const {authRequest} = require('../middlewares/authRequest');
const {followUser} = require('../controllers/followController');

router.get('/follow/:userId',authRequest,followUser);


module.exports = router;