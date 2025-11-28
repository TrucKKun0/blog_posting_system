require('dotenv').config();
const amqp = require('amqplib');
const logger = require('../utils/logger');

let connection = null;
let channel = null;
const EXCHANGE_NAME = 'blog_posting_system_event';

const connectToRabbitMQ = async()=>{
    try{
        connection = await amqp.connect(process.env.RABBITMQ_URL);
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
async function publishEvent(routingKey,message){
    if(!channel){
        await connectToRabbitMQ();
    }
    channel.publish(EXCHANGE_NAME,routingKey,Buffer.from(JSON.stringify(message)));
    logger.info(`Event published to RabbitMQ with routing key: ${routingKey, message}`);

}

async function consumeEvent( routingKey, callback){
    if(!channel){
        await connectToRabbitMQ();
    }
    const q = await channel.assertQueue("", {exclusive: true });
    await channel.bindQueue(q.queue,EXCHANGE_NAME,routingKey);
    channel.consume(q.queue,(msg)=>{
        if(msg !== null){
            const content = JSON.parse(msg.content.toString());
            callback(content);
            channel.ack(msg);
        }
    });
    logger.info(`Event consumed from RabbitMQ with routing key: ${routingKey}`);
}

module.exports = {publishEvent,consumeEvent, connectToRabbitMQ};