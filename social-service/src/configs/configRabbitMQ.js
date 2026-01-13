const amqp = require('amqplib');
const logger = require('../../utils/logger');

let connection = null;
let channel = null;

const connectToRabbitMQ = async ()=>{
    try{
        connection = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();
        await channel.assertExchange(process.env.EXCHANGE_NAME,'topic',{durable : true});
        logger.info(`Connected to RabbitMQ Successfully`);
        return {connection,channel};

    }catch(error){
        logger.error(`RabbitMQ connection error: ${error.message}`);
        process.exit(1);
    }
}

const publishEvent = async (routingKey,message)=>{
    if(!channel){
        await connectToRabbitMQ();
    }
    channel.publish(process.env.EXCHANGE_NAME,routingKey,Buffer.from(JSON.stringify(message)));
    logger.info(`Event published to RabbitMQ with routing key: ${routingKey}, message: ${JSON.stringify(message)}`);
}

module.exports = {connectToRabbitMQ,publishEvent};