const mongoose = require('mongoose');
const argon2 = require('argon2');
const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
},{timestamps:true});

userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        try{
            this.password = await argon2.hash(this.password);
        }catch(err){
            return next(err);
        }
    }
})

userSchema.index({username:"text"});

userSchema.methods.comparePassword = async function(candidatePassword){
    try{
        return await argon2.verify(this.password, candidatePassword);
    }catch(err){
        throw err;
    }
}
userSchema.methods.changePassword = async function(newPassword){
    try{
        this.password = await argon2.hash(newPassword);
        await this.save();
    }catch(err){
        throw err;
    }
}
userSchema.index({username:"text", email:"text"});
module.exports = mongoose.model('User', userSchema);




