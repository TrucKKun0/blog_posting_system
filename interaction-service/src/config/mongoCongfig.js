const logger = require("../utils/logger");
const mongoose = require("mongoose");


const connectToMongo = async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        logger.info("Connected to MongoDB");

    }catch(error){
        logger.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);    
    }
}