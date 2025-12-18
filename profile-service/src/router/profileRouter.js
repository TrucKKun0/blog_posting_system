const express = require('express')
const router = express.Router()
const {updateUserProfile,getProfile,deleteAvater} = require('../controller/profile-controller')
const {authRequest} = require('../middlewares/authRequest');
const multer = require('multer');
const upload = multer({dest:'/uploads'});
const {invalidateProfileCache} = require('../utils/redisInvalidation');
const logger = require('../utils/logger');


router.post('/update',authRequest,invalidateProfileCache,upload.single('avatar'),updateUserProfile);
router.get('/healthcheck',(req,res)=>{
    logger.info('Healthcheck endpoint called');
    res.status(200).json({status:'Profile Service is healthy'});
});
// Specific routes MUST come before wildcard routes
router.get("/delete-avatar",authRequest,deleteAvater);
router.get("/:userId",authRequest,getProfile);


module.exports = router;