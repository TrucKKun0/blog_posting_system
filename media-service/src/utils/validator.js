const joi = require('joi');

const validateUploadMedia = async (data)=>{
    const schema = joi.object({
        originalname : joi.string().required(),
        mimetype : joi.string().required(),
        userId : joi.string().required(),
    })
    return schema.validate(data)
}

module.exports = {validateUploadMedia};