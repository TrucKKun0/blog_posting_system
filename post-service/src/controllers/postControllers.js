const { v4: uuidv4 } = require("uuid");
const logger = require("../utils/logger");
const Post = require("../models/postModel");
const redis = require("../config/redisConfig");
const axios = require("axios");
const FormData = require("form-data");
const Content = require("../models/contentModel");
const mongoose = require("mongoose");

const { validatePost } = require("../utils/validatePost");
const { publishEvent } = require("../config/rabbitMQConfig");
const { fetchUsernameById, fetchUserById, fetchUsersByIds } = require("../utils/userService");

// ─── Constants ───────────────────────────────────────────────────────────────

const MEDIA_UPLOAD_URL = process.env.MEDIA_SERVICE_URL || "http://localhost:3003/api/media/upload";
const DEFAULT_CACHE_EXPIRY = 300; // 5 minutes in seconds

// ─── Helpers ─────────────────────────────────────────────────────────────────

const generateSnippet = (text, maxLength = 120) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

/**
 * Upload a file to the media service via multipart form data.
 * Returns { url, publicId } on success, or null on failure.
 */
const uploadMedia = async (file, userId) => {
  try {
    const formData = new FormData();
    formData.append("file", file.buffer, file.originalname);

    const response = await axios.post(MEDIA_UPLOAD_URL, formData, {
      headers: {
        ...formData.getHeaders(),
        "x-user-id": userId,
      },
    });

    if (response.status === 200 && response.data.success) {
      return { url: response.data.url, publicId: response.data.publicId };
    }
    return null;
  } catch (error) {
    logger.error(`Media upload failed: ${error.message}`);
    return null;
  }
};

// ─── Controllers ─────────────────────────────────────────────────────────────

const createPost = async (req, res) => {
  logger.info("Create Post Controller");

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId } = req.user;
    const { title, category, status, content } = req.body;

    logger.info(`Creating post - userId: ${userId}, title: ${title}, status: ${status}`);

    if (!userId) {
      logger.error("userId is missing from req.user");
      return res.status(401).json({
        success: false,
        message: "User authentication failed - userId missing",
      });
    }

    const mode = status === "published" ? "create" : "draft";
    const { error } = await validatePost(req.body, mode);
    if (error) {
      logger.error(`Validation Error at createPost: ${error.message}`);
      return res.status(422).json({
        success: false,
        message: `Validation Error: ${error.message}`,
      });
    }

    // Upload image if publishing with an attached file
    let postImageUrl = null;
    let postImagePublicId = null;

    if (status === "published" && req.file) {
      const media = await uploadMedia(req.file, userId);
      if (media) {
        postImageUrl = media.url;
        postImagePublicId = media.publicId;
      }
    }

    // Create content and post within the transaction
    const [createdContent] = await Content.create(
      [{ userId, content }],
      { session }
    );

    const [createdPost] = await Post.create(
      [
        {
          authorId: userId,
          title,
          category,
          contentId: createdContent._id,
          status,
          publishedAt: status === "published" ? Date.now() : null,
          postImagePublicId,
          postImageUrl,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    // Publish event (outside transaction — best-effort)
    const snippet = generateSnippet(content);
    const authorName = (await fetchUsernameById(userId)) || "Unknown";

    await publishEvent("post.published", {
      eventId: uuidv4(),
      eventType: "post.published",
      postId: createdPost._id,
      authorId: userId,
      authorName,
      title,
      category,
      content: snippet,
      mediaUrl: postImageUrl,
      slug: createdPost.slug,
      status,
      publishedAt: createdPost.publishedAt,
    });

    logger.info(`Post created successfully with ID: ${createdPost._id}`);
    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: createdPost,
    });
  } catch (error) {
    await session.abortTransaction();
    logger.error(`Error in createPost: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  } finally {
    session.endSession();
  }
};

const publishPost = async (req, res) => {
  logger.info("Publish Post Controller");

  try {
    const { userId } = req.user;
    const { postId } = req.params;

    const postToPublish = await Post.findOne({ _id: postId, authorId: userId });
    if (!postToPublish) {
      logger.error("Post not found or unauthorized user");
      return res.status(404).json({
        success: false,
        message: "Post not found or unauthorized user",
      });
    }

    if (postToPublish.status !== "draft") {
      logger.error(`Post is already published with ID: ${postId}`);
      return res.status(400).json({
        success: false,
        message: "Post is already published",
      });
    }

    const { title, category, content } = req.body;

    const { error } = await validatePost(
      { title, category, content, status: "published" },
      "create"
    );
    if (error) {
      logger.error(`Validation Error at publishPost: ${error.message}`);
      return res.status(422).json({
        success: false,
        message: `Validation Error: ${error.message}`,
      });
    }

    // Handle optional image upload
    let { postImageUrl, postImagePublicId } = postToPublish;

    if (req.file) {
      const media = await uploadMedia(req.file, userId);
      if (media) {
        postImageUrl = media.url;
        postImagePublicId = media.publicId;
      }
    }

    // Update content
    await Content.updateOne(
      { _id: postToPublish.contentId },
      { $set: { content } }
    );

    // Update post fields
    postToPublish.title = title || postToPublish.title;
    postToPublish.category = category || postToPublish.category;
    postToPublish.postImageUrl = postImageUrl;
    postToPublish.postImagePublicId = postImagePublicId;
    postToPublish.status = "published";
    postToPublish.publishedAt = Date.now();
    await postToPublish.save();

    logger.info(`Post published successfully with ID: ${postToPublish._id}`);
    return res.status(200).json({
      success: true,
      message: "Post published successfully",
      data: postToPublish,
    });
  } catch (error) {
    logger.error(`Error in publishPost: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

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

    // Update basic fields
    foundPost.title = title || foundPost.title;
    foundPost.category = category || foundPost.category;

    // Handle optional image upload
    if (req.file) {
      const media = await uploadMedia(req.file, userId);
      if (media) {
        foundPost.postImageUrl = media.url;
        foundPost.postImagePublicId = media.publicId;
      }
    }

    await foundPost.save();

    logger.info(`Post updated successfully with ID: ${foundPost._id}`);
    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: foundPost,
    });
  } catch (error) {
    logger.error(`Error in updatePost: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getAllPosts = async (req, res) => {
  logger.info("Get All Posts Controller");

  try {
    const cacheKey = "posts:all";
    const cachedPosts = await redis.get(cacheKey);

    // Return from cache if available
    if (cachedPosts) {
      logger.info("Responding from cache");
      return res.status(200).json({
        success: true,
        message: "Posts fetched successfully (cached)",
        data: JSON.parse(cachedPosts),
      });
    }

    const posts = await Post.find({});

    // Fetch author details for all posts
    const authorIds = [...new Set(posts.map((post) => post.authorId.toString()))];
    const users = await fetchUsersByIds(authorIds);

    const userMap = {};
    users.forEach((user) => {
      userMap[user._id.toString()] = user;
    });

    const postsWithAuthors = posts.map((post) => ({
      ...post.toObject(),
      authorId: {
        _id: post.authorId,
        username: userMap[post.authorId.toString()]?.username || "Unknown",
        email: userMap[post.authorId.toString()]?.email || null,
      },
    }));

    // Cache the result
    await redis.setex(cacheKey, DEFAULT_CACHE_EXPIRY, JSON.stringify(postsWithAuthors));

    return res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      data: postsWithAuthors,
    });
  } catch (error) {
    logger.error(`Error in getAllPosts: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getOnePost = async (req, res) => {
  logger.info("Get One Post Controller");

  try {
    const postSlug = req.params.slug;
    const post = await Post.findOne({ slug: postSlug }).populate('contentId');

    if (!post) {
      logger.error(`Post not found with slug: ${postSlug}`);
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Fetch author details
    const author = await fetchUserById(post.authorId.toString());

    const postWithAuthor = {
      ...post.toObject(),
      content: post.contentId?.content || post.content || "",
      authorId: {
        _id: post.authorId,
        username: author?.username || "Unknown",
        email: author?.email || null,
      },
    };

    return res.status(200).json({
      success: true,
      message: "Post fetched successfully",
      data: postWithAuthor,
    });
  } catch (error) {
    logger.error(`Error in getOnePost: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getOnePostById = async (req, res) => {
  logger.info("Get One Post By ID Controller");

  try {
    const postId = req.params._id;
    const post = await Post.findById(postId).populate('contentId');

    if (!post) {
      logger.error(`Post not found with ID: ${postId}`);
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Fetch author details
    const author = await fetchUserById(post.authorId.toString());

    const postWithAuthor = {
      ...post.toObject(),
      content: post.contentId?.content || post.content || "",
      authorId: {
        _id: post.authorId,
        username: author?.username || "Unknown",
        email: author?.email || null,
      },
    };

    return res.status(200).json({
      success: true,
      message: "Post fetched successfully",
      data: postWithAuthor,
    });
  } catch (error) {
    logger.error(`Error in getOnePostById: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const deletePost = async (req, res) => {
  logger.info("Delete Post Controller");

  try {
    const { userId } = req.user || {};
    const postId = req.params._id;

    if (!userId) {
      logger.error(`User authentication failed - no userId found`);
      return res.status(401).json({
        success: false,
        message: "User authentication failed",
      });
    }

    const postToDelete = await Post.findById(postId);
    if (!postToDelete) {
      logger.error(`Post not found with ID: ${postId}`);
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (postToDelete.authorId.toString() !== userId) {
      logger.error(`Unauthorized delete attempt by user ID: ${userId}`);
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this post",
      });
    }

    await publishEvent("post.deleted", {
      userId,
      publicId: postToDelete.postImagePublicId,
      postId: postToDelete._id,
    });

    await Post.findByIdAndDelete(postId);

    logger.info(`Post deleted successfully with ID: ${postId}`);
    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    logger.error(`Error in deletePost: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
const getCategoryPosts = async (req, res) => {
  logger.info("Get Category Posts Controller");

  try {
    const category = req.params.category;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    const posts = await Post.find({ category })
      .populate({
        path: "contentId",
        select: "content"
      })
      .sort({ createdAt: -1 });

    if (posts.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No posts found for this category",
        data: [],
      });
    }

    // Extract content as string from contentId object
    const formattedPosts = posts.map(post => {
      const obj = post.toObject();
      return {
        ...obj,
        content: obj.contentId?.content || "",
        contentId: undefined
      };
    });

    return res.status(200).json({
      success: true,
      message: "Category posts fetched successfully",
      data: formattedPosts,
    });

  } catch (error) {
    logger.error(`Error in getCategoryPosts: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getAuthorPosts = async (req, res) => {
  logger.info("Get Author Posts Controller");

  try {
    const { userId } = req.user || {};
    const { authorId } = req.query;
    const targetAuthorId = authorId || userId;

    if (!targetAuthorId) {
      return res.status(401).json({
        success: false,
        message: "User authentication failed",
      });
    }

    const posts = await Post.find({ authorId: targetAuthorId })
      .populate('contentId')
      .sort({ createdAt: -1 });

    // Fetch author details
    const author = await fetchUserById(targetAuthorId);

    const postsWithAuthor = posts.map(post => {
      const obj = post.toObject();
      return {
        ...obj,
        content: obj.contentId?.content || "",
        author: {
          _id: author?._id,
          name: author?.username || "Unknown",
          email: author?.email || null,
        },
        contentId: undefined
      };
    });

    return res.status(200).json({
      success: true,
      message: "Author posts fetched successfully",
      blog: postsWithAuthor,
    });
  } catch (error) {
    logger.error(`Error in getAuthorPosts: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
const postUpdate = async (req, res) => {
  logger.info("Post Update Controller");
  
  try {
    const { _id } = req.params;
    const { title, content, category, status } = req.body;
    const { userId } = req.user || {};
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication failed",
      });
    }
    
    const post = await Post.findById(_id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    
    if (post.authorId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this post",
      });
    }
    
    const updateData = {};
    
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (category) updateData.category = category;
    if (status) updateData.status = status;
    
    const updatedPost = await Post.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true }
    ).populate('contentId');
    
    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: updatedPost,
    });
    
  } catch (error) {
    logger.error(`Error in postUpdate: ${error.message}`);
    return res.status(500).json({
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
  getOnePostById,
  updatePost,
  publishPost,
  getCategoryPosts,
  getAuthorPosts,
};
