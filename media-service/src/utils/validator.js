const joi = require('joi');

const validateUploadMedia = async (data)=>{
    const schema = joi.object({
        publicId : joi.string().required(),
        originalName : joi.string().required(),
        mimeType : joi.string().required(),
        userId : joi.string().required(),
        url : joi.string().required()
    })
    return schema.validate(data)
}

module.exports = {validateUploadMedia};