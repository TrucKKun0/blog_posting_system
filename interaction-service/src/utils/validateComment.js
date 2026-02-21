const joi = require("joi");

const validateComment = async (data)=>{
    const Schema = joi.object({
        content : joi.string(),
        targetType : joi.valid("post" , "comment")
    })
    return Schema.validate(data);
}

module.exports = {validateComment};