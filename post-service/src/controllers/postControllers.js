const logger = require('../utils/logger');
const {Post} = require('../models/postModel');
const fs =require('fs');
const axios = require('axios');
const FormData = require('form-data');

const {validatePost} = require('../utils/validatePost');

const createPost = async(req,res)=>{
    logger.info("Create Post Controller");
    try{
        const {userId} = req.user;
        const {error} = await validatePost(req.body);
        if(error){
            logger.error(`Validation Error: ${error.details[0].message}`);
            return res.status(400).json({
                success:false,
                message:`Validation Error: ${error.details[0].message}`
            });
        }

        const {title,categories,isPublished,publishedAt} = req.body;

        let postImageUrl = null;
        let postImagePublicId = null;

        const hasImageFile = req.file;

        if(hasImageFile){
            const formData = new  FormData();
            formData.append('file',fs.createReadStream(req.file.path),req.file.originalname);
            const mediaResponse = await axios.post(
                'http://localhost:3003/api/media/upload',
                formData,
                {
                    headers:{
                        ...formData.getHeaders(),
                        'x-user-id': userId
                    }
                }
            );
            if(mediaResponse.status === 200 && mediaResponse.data.success){
                postImagePublicId = mediaResponse.data.publicId;
                postImageUrl = mediaResponse.data.url;
            }
            
        }

        const newPost = await Post.create({
            authorId:userId,
            title,
            categories,
            postImageUrl,
            isPublished,
            publishedAt,
            postImagePublicId
        })
        logger.info(`Post created successfully with ID: ${newPost._id}`);
        res.status(201).json({
            success:true,
            message:"Post created successfully",
            data:newPost
        })


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