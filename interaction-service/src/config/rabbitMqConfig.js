const logger = require("../utils/logger");
const amqp = require("amqplib");

let connection = null;
let channel= null;

const connectToRabbitMQ = async ()=>{
    try{
        connection = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();
        await channel.assertExchange(process.env.EXCHANGE_NAME,'topic', {durable : true});
        logger.info(`Connected to RabbitMQ succesfully`);
        return {connection,channel};
    }catch(error){
        logger.error(`RabbitMQ connection error: ${error.message}`);
        process.exit(1);
    }
}
const consumeEvent = async(callback)=>{
    if(!channel){
        await connectToRabbitMQ();
    }
    await channel.assertQueue(process.env.QUEUE_NAME,{durable : true});
    await channel.bindQueue(process.env.QUEUE_NAME,process.env.EXCHANGE_NAME,"post.*");
    channel.consume(process.env.QUEUE_NAME,(msg)=>{
        if (msg !== null){
            const content = JSON.parse(msg.content.toString());
            callback(content);
            channel.ack(msg);
        }
    },{noAck : false});
    logger.info(`Event consumed from RabbitMQ with queue name : ${process.env.QUEUE_NAME}`);

}

const publishEvent =  async (routingKey,message)=>{
    if(!channel){
        await connectToRabbitMQ();
    }
     channel.publish(process.env.EXCHANGE_NAME,routingKey,Buffer.from(JSON.stringify(message)));
    logger.info(`Event published to RabbitMQ with routing key: ${routingKey}`);
}

module.exports = {connectToRabbitMQ,consumeEvent,publishEvent};