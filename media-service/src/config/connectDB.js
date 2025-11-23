require("dotenv").config();
const mongoose = require('mongoose');
const logger = require('../utils/logger');
const MONGODB_URI = process.env.MONGODB_URI;

const connectToDB = async ()=>{
    try{
        await mongoose.connect(MONGODB_URI);
        logger.info("Connection established with MongoDB");
    }catch(error){
        logger.error(`MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
}
module.exports = {connectToDB}