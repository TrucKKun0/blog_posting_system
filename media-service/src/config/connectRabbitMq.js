require('dotenv').config();
const amqp = requuire('amqplib');
const logger = rqeuire('../utils/logger');

let connection = null;
let channel = null;
const EXCHANGE_NAME = 'blog_posting_system_event';

const connectToRabbitMQ = async()=>{
    try{
        connection = amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();

        await channel.assertExchange(EXCHANGE_NAME,'topic',{durable : true});
        logger.info('Connected To RabbitMQ Successfully');
        return {connection,channel};
    }
    catch(error){
        logger.error(`RabbitMQ connection error: ${error.message}`);
        process.exit(1);
    }
}

module.exports = {connectToRabbitMQ};
