require('dotenv').config();
const mongoose = require('mongoose');
const logger = require('../utils/logger');

const MONGODB_URI = process.env.MONGODB_URI;

const connectToMongoDB = async () => {
    if (!MONGODB_URI) {
        logger.error("MONGODB_URI is not defined in environment variables");
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGODB_URI);
        logger.info(`MongoDB Connected`);
        

    } catch (error) {
        logger.error(`MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
}

module.exports = connectToMongoDB;
