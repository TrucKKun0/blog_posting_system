const logger = require('../utils/logger');
const UserProfile = require('../models/userProfile');

const handleProfileCreated = async (event)=>{
    console.log(event);
    
}

module.exports = {handleProfileCreated};