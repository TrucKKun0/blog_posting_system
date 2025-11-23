const logger = require('../utils/logger');
const {uploadMedia} = require("../controller/media-controllers")
const express = require("express");
const { authRequest } = require('../middlewares/authRequest');
const multer = require('multer');
const router = express.Router();

router.use(authRequest)

const upload = multer({
    storage:multer.memoryStorage(),
    limit : {fileSize:1024*1024*5} // 10MB max file size

}).single("file");

router.post('/upload',(req,res,next)=>{
    upload(req,res,(err)=>{
        if(err instanceof multer.MulterError){
            logger.error(`Multer Upload Error: ${err.message}`);
            return res.status(400).json({
                success:false,
                message:"File size too large"
            }
        
        )}
        else if(err){
            logger.error(`Unknow upload error: ${err.message}`);
            return res.status(500).json({
                success:false,
                message:"Internal Server Error"
            })
       
        }
        if (!req.file){
            logger.error("No file provided");
            return res.status(400).json({
                success:false,
                message:"No file provided"
            })
        }
        next();
    })
},uploadMedia);

module.exports = router;