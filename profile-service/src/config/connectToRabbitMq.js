const logger = require ('../utils/logger');
const amqp = require('amqplib');
const EXCHANGE_NAME = 'blog_posting_system_event';

let connection = null;
let channel = null;

const connectToRabbitMQ = async ()=>{
    try{
        await amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();

        await channel.assetExchange(EXCHANGE_NAME,'topic',{durable:true});
        logger.info(`Connected to RabbitMQ server successfully`)
        return { channel,connection};

    }catch(error){
        logger.error(`RabbitMQ connection error: ${error.message}`);
        process.exit(1);
    }
}