const logger = require("../utils/logger");
const { Post } = require("../models/postModel");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const {Content} = require('../models/contentModel');

const { validatePost } = require("../utils/validatePost");

const createPost = async (req, res) => {
  logger.info("Create Post Controller");
  try{
    const {userId} = req.user;
    const {title,category,status,content} = req.body;

    const mode = status === "published" ? "create" : "draft";
    const {error} = validatePost(req.body,mode);
    if(error){
      logger.error(`Validation Error at createPost:${error.message}`);
      return res.status(422).json({       // Status code 422 is for Unprocessable Entity
        success:false,
        message:`Validation Error at createPost: ${error.message}`
      })
    }
    let postImageUrl = null;
    let postImagePublicId = null;
    //uploads image to cloudinary if status is published and image is provided
    if(status === "published" && req.file){
      const formData  = new FormData();
      formData.append(file,fs.createReadStream(req.file.path),req.file.originalname);
      const mediaResponse = await axios.post(
        "http://localhost:3003/api/media/upload",
        formData,
        {
          headers: {
            ...formData.getHeaders(), // this will copy all the headers formData.getHeaders() methods and add them to the headers
            "x-user-id": userId,
          },
        }
      )
      if(mediaResponse.status === 200 && mediaResponse.data.success){
        postImageUrl = mediaResponse.data.url;
        postImagePublicId = mediaResponse.data.publicId;
      }
    }
    const createdContent = await Content.create({
      userId,
      content
    })
    const createdPost = await Post.create({
      authorId : userId,
      title,
      postImageUrl,
      category,
      contentId: createdContent._id,
      status,
      publishedAt: status === "published" ? Date.now() : null,
      postImagePublicId,
      postImageUrl
    })
    logger.info(`Post created successfully with ID: ${createdPost._id}`);
    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: createdPost,
    });


  }catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }//removes the image from the server if it is uploaded
  finally{
    if(req.file){
      fs.unlinkSync(req.file.path);
    }
  }
};

const publishPost = async(req,res)=>{
  
}

const updatePost = async (req, res) => {
  logger.info("Update Post Controller");
  try {
    const { userId } = req.user;
    const postId = req.params._id;
    const { error } = await validatePost(req.body, "update");
    if (error) {
      logger.error(`Validation Error: ${error.details[0].message}`);
      return res.status(400).json({
        success: false,
        message: `Validation Error: ${error.details[0].message}`,
      });
    }
    const { title, category } = req.body;
    const foundPost = await Post.findById(postId);
    if (!foundPost) {
      logger.error(`Post not found with ID: ${postId}`);
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    if (foundPost.authorId.toString() !== userId) {
      logger.error(`Unauthorized update attempt by user ID: ${userId}`);
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this post",
      });
    }
    foundPost.title = title || foundPost.title;
    foundPost.category = category || foundPost.category;

    if (!req.file) {
      await foundPost.save();
      logger.info(`Post updated successfully with ID: ${foundPost._id}`);
      return res.status(200).json({
        success: true,
        message: "Post updated successfully",
        data: foundPost,
      });
    }
    //Handle Image Update
    let postImageUrl = foundPost.postImageUrl;
    let postImagePublicId = foundPost.postImagePublicId;
    const formData = new FormData();
    formData.append(
      "file",
      fs.createReadStream(req.file.path),
      req.file.originalname
    );
    const mediaResponse = await axios.post(
      "http://localhost:3003/api/media/upload",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "x-user-id": userId,
        },
      }
    );
    if (mediaResponse.status === 200 && mediaResponse.data.success) {
      postImagePublicId = mediaResponse.data.publicId;
      postImageUrl = mediaResponse.data.url;
    }
    foundPost.postImageUrl = postImageUrl;
    foundPost.postImagePublicId = postImagePublicId;
    await foundPost.save();
    logger.info(`Post updated successfully with ID: ${foundPost._id}`);
    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: foundPost,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getAllPosts = async (req, res) => {
  logger.info("Get All Posts Controller");
  try {
    const posts = await Post.find({});
    res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      data: posts,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getOnePost = async (req, res) => {
  logger.info("Get One Post Controller");
  try {
    const postSlug = req.params.slug;
    const post = await Post.findOne({ slug: postSlug });
    if (!post) {
      logger.error(`Post not found with slug: ${postSlug}`);
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Post fetched successfully",
      data: post,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const deletePost = async (req, res) => {
  logger.info("Delete Post Controller");
  try {
    const { userId } = req.user;
    const postId = req.params._id;
    const postToDelete = await Post.findById(postId);
    if (!postToDelete) {
      logger.error(`Post not found with ID: ${postId}`);
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    const isauthor = postToDelete.authorId.toString() === userId;
    if (!isauthor) {
      logger.error(`Unauthorized delete attempt by user ID: ${userId}`);
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this post",
      });
    }
    await publishEvent("post.deleted", {
      userId: userId,
      publicId: postToDelete.postImagePublicId,
    });
    await Post.findByIdAndDelete(postId);
    logger.info(`Post deleted successfully with ID: ${postId}`);
    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createPost,
  deletePost,
  getAllPosts,
  getOnePost,
  updatePost,
};
