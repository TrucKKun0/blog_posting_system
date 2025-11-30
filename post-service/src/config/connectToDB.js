require('dotenv').config();
const mongoose = require('mongoose');
const logger = require('../utils/logger');

const MONGODB_URI = process.env.MONGODB_URI;

const connectToDB = async ()=>{
    try{
        await mongoose.connect(MONGODB_URI);
        logger.info(`Conected to MongoDB successfully`);
    }catch(error){
        logger.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
}

module.exports = connectToDB;
