const logger = require('../utils/logger');

const joi = require('joi');

const validatePost = async (data)=>{
    const postSchema = joi.object({
        title : joi.string().min(3).max(100).required(),
        categories : joi.string().valid('Technology', 'Health', 'Lifestyle', 'Education', 'Entertainment').required(),
        postImageUrl : joi.string(),
        isPublished : joi.boolean().default(false).required(),
        publishedAt : joi.date().default(Date.now()).required()
    })
    return postSchema.validate(data);
}
module.exports = {validatePost};
