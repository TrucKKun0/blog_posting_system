const amqp = require('amqplib');
const logger = require('../utils/logger');

EXCHANGE_NAME = 'blog_posting_system_event';
let channel = null;
let connection = null;

const connectToRabbitMQ = async()=>{
    try{
        connection = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();
        await channel.assertExchange(EXCHANGE_NAME,'topic',{durable:true});
        logger.info(`Connected to RabbitMQ server successfully`);
        return {channel,connection};

    }catch(error){
        logger.error(`RabbitMQ connection error: ${error.message}`);
        process.exit(1);
    }
}
const publishEvent = async(routingKey,message)=>{
    if(!channel){
        await connectToRabbitMQ();
    }
    channel.publish(EXCHANGE_NAME,routingKey,Buffer.from(JSON.stringify(message)));
    logger.info(`Event published to RabbitMQ with routing key: ${routingKey}`);

}
const consumeEvent = async(routingKey,callback)=>{
    if(!channel){
        await connectToRabbitMQ();
    }
    const q = await channel.assertQueue("",{exclusive:true});
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

module.exports = {connectToRabbitMQ, publishEvent, consumeEvent};