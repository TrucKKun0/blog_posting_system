const joi = require('joi');

const validateUploadMedia = async (data)=>{
    const schema = joi.object({
        originalName : joi.string().required(),
        mimeType : joi.string().required(),
        userId : joi.string().required(),
    })
    return schema.validate(data)
}

module.exports = {validateUploadMedia};