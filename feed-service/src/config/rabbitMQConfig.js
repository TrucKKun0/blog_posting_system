const amqp = require("amqplib");
const logger = require("../utils/logger");
let connection = null;
let channel = null;
const connectToRabbitMQ = async ()=>{
    try{
         connection = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();
        channel.assertExchange(process.env.EXCHANGE_NAME,"topic" , {durable : true});
        logger.info("Connected to RabbitMQ");
        return { connection, channel };
    } catch (error) {
        logger.error("Error connecting to RabbitMQ:", error);
        throw error;
    }
}

const publishEvent = async (routingKey,message)=>{
if(!channel){
    await connectToRabbitMQ();
}
channel.pulish(process.env.EXCHANGE_NAME, routingKey, Buffer.from(JSON.stringify(message)));
logger.info(`Event published to RabbitMQ with routing key: ${routingKey}`);
}

const consumeEvent = async(routingKey,callback)=>{
    if(!channel){
        await connectToRabbitMQ();
    }
    await channel.assertQueue(process.env.FEED_QUEUE_NAME,{durable : true});
    await channel.bindQueue(process.env.FEED_QUEUE_NAME,process.env.EXCHANGE_NAME,routingKey);
    channel.consume(process.env.FEED_QUEUE_NAME,(msg)=>{
        if(msg !== null){
            const content = JSON.parse(msg.content.toString());
            callback(content);
            channel.ack(msg);
        }
    },{noAck : false});
    logger.info(`Event consumed from RabbitMQ with queue name : ${process.env.FEED_QUEUE_NAME}`);
}
module.exports = {connectToRabbitMQ, publishEvent, consumeEvent};