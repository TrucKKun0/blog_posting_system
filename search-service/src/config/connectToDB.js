const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectToMongoDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        logger.info("Connected to MongoDB");
    }catch(error){
        logger.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
}

module.exports = {connectToMongoDB};