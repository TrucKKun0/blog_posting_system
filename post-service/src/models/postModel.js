const mongoose = require('mongoose')

const PostSchema = mongoose.Schema({
    authorId:{
        type: mongoose.Schema.ObjectId,
        required: true,
        ref:"User"
    },
    title:{
        type: String,
        required: true,
        trim: true
    },
    slug:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    contentId : {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref:"Content"
    },
    likesCount:{
        type: Number,
        default: 0
    },
    commentCount : {
        type : Number,
        default : 0
    },
    isPublished : {
        type: Boolean,
        default: false
    },
    publishedAt : {
        type: Date,
        default : Date.now()
    },
    categories : {
        type : String,
        enum: ['Technology', 'Health', 'Lifestyle', 'Education', 'Entertainment'],
        required: true
    },
    postImageUrl : {
        type : String
    }

    
},{timestamps:true});

PostSchema.index({title: 'text'});
PostSchema.index({slug: 1}, {unique: true});
PostSchema.index({authorId: 1, publishedAt: -1});

module.exports = mongoose.model('Post',PostSchema);