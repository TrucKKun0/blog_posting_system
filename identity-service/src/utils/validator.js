const joi = require('joi');

const validateUserRegistration = async(data)=>{
    const schema = joi.object({
        username:joi.string().min(3).max(30).required(),
        email:joi.string().email().required(),
        password:joi.string().min(6).max(30).required()
    })
    return schema.validate(data);
}

const validateUserLogin = async(data)=>{
    const schema = joi.object({
        email:joi.string().email().required(),
        password:joi.string().min(6).max(30).required()
    })
    return schema.validate(data);
}
const validateForgetPassword = async(data)=>{
    const schema = joi.object({
        email:joi.string().email().required(),
        newPassword:joi.string().min(6).max(30).required()
    })
    return schema.validate(data);
}

module.exports = {
    validateUserRegistration,
    validateUserLogin,
    validateForgetPassword
}

