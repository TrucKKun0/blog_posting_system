const logger = require('../utils/logger');
const joi = require('joi');

const validateUpdateProfile = async (data)=>{
    const schema = joi.object({
        bio : joi.string().max(100),
        avatarId : joi.string(),
    })
    return schema.validate(data);
}

module.exports = {validateUpdateProfile};