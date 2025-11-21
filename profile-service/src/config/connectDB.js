require('dotenv').config();
const logger = require('../utils/logger');

const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI;
const connectToDB = async ()=>{
    try{
        await mongoose.connect(MONGODB_URI);
        logger.info(`MongoDB Connected:`);
    }catch(error){
        logger.error(`MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
}