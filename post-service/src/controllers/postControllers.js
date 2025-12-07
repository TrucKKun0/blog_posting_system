const logger = require('../utils/logger');


const createPost = async(req,res)=>{
    logger.info("Create Post Controller");
    try{
        

    }catch(error){
        logger.error(error.message);
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}
const deletePost = async(req,res)=>{
    logger.info("Delete Post Controller");
    try{

    }catch(error){
        logger.error(error.message);
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

module.exports = {createPost,deletePost};