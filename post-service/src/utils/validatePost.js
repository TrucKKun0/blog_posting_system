const logger = require('../utils/logger');

const joi = require('joi');

const validatePost = async (data)=>{
    const postSchema = joi.objecct({
        title : joi.string().min(3).max(100).required(),
        slug : joi.string().min(3).max(100).required(),
        contentId : joi.string().required(),
        userId : joi.string().required(),
        categories : joi.string().value(['Technology', 'Health', 'Lifestyle', 'Education', 'Entertainment']).required(),
        postImageUrl : joi.string(),
        isPublished : joi.boolean().default(false),
        publishedAt : joi.date().default(Date.now())
    })
    return postSchema.validate(data);
}
module.exports = {validatePost};
