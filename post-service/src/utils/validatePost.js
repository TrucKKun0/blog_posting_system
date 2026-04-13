const logger = require('../utils/logger');

const joi = require('joi');

const createPostSchema = joi.object({
    title : joi.string().min(5).max(100),
    category : joi.string().valid('Technology','Health','Lifestyle','Education','Entertainment','Business','Travel','Food','Sports','Politics'),
    status : joi.string().valid('draft','published'),
    content:joi.string().min(10)
})

const validatePost = async (data, mode="create")=>{
    return createPostSchema.prefs({presence : mode === "create" ? "required" : "optional"}).validate(data);
}

module.exports = {validatePost};
