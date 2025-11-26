const logger = require('./logger');
const {connectToRabbitMQ} = require('../config/connectToRabbitMq');
const amqp = require('amqplib');

const EXCHANGE_NAME = 'blog_posting_system_event';

async function consumeEvent(routingKey,callback){
    if(!channel){
        await connectToRabbitMQ();
    }
    const q = await channel.assertQueue("",{exclusive : true});
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

async function publishEvent(routingKey,callback){
if(!channel){
    await connectToRabbitMQ();
}
channel.publish(EXCHANGE_NAME,routingKey,Buffer.from(JSON.stringify(message)));
logger.info(`Event published to RabbitMQ with routing key: ${routingKey}`);

}

module.exports = {consumeEvent};