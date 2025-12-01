const express = require('express')
const router = express.Router()
const {updateUserProfile} = require('../controller/profile-controller')
const {authRequest} = require('../middlewares/authRequest');

const logger = require('../utils/logger');


router.post('/update',authRequest,updateUserProfile);
router.get('/healthcheck',(req,res)=>{
    logger.info('Healthcheck endpoint called');
    res.status(200).json({status:'Profile Service is healthy'});
});

module.exports = router;