const express = require('express')
const router = express.Router()
const {updateUserProfile,getProfile,deleteAvater} = require('../controller/profile-controller')
const {authRequest} = require('../middlewares/authRequest');
const multer = require('multer');
const upload = multer({dest:'/uploads'});

const logger = require('../utils/logger');


router.post('/update',authRequest,upload.single('avatar'),updateUserProfile);
router.get('/healthcheck',(req,res)=>{
    logger.info('Healthcheck endpoint called');
    res.status(200).json({status:'Profile Service is healthy'});
});
router.get("/:userId",authRequest,getProfile);
router.delete("/delete-avatar",authRequest,deleteAvater);


module.exports = router;