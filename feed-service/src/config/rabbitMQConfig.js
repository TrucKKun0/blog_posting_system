const amqp = require("amqplib");
const logger = require("../utils/logger");
const EXCHANGE_NAME = process.env.EXCHANGE_NAME;
const QUEUE_NAME = process.env.FEED_QUEUE_NAME || "feed_queue";
let connection = null;
let channel = null;
const connectToRabbitMQ = async ()=>{
    try{
         connection = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();
        await channel.assertExchange(EXCHANGE_NAME,"topic" , {durable : true});
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
    channel.publish(EXCHANGE_NAME, routingKey, Buffer.from(JSON.stringify(message)));
    logger.info(`Event published to RabbitMQ exchange=${EXCHANGE_NAME} routingKey=${routingKey} message=${JSON.stringify(message)}`);
}

const consumeEvent = async (routingKey, callback) => {
    if (!channel) {
        await connectToRabbitMQ();
    }

    // Create a unique queue for each routing key to prevent message collision
    const uniqueQueueName = `${QUEUE_NAME}_${routingKey}`;
    const q = await channel.assertQueue(uniqueQueueName, { durable: true });
    await channel.bindQueue(q.queue, EXCHANGE_NAME, routingKey);

    channel.consume(q.queue, async (msg) => {
        if (msg !== null) {
            const content = JSON.parse(msg.content.toString());
            const eventType = msg.fields.routingKey; // ✅ extract from message
            logger.info(`RabbitMQ consumed message with routing key: ${eventType}`);
            await callback({ ...content, eventType }); // ✅ inject into event
            channel.ack(msg);
        }
    });

    logger.info(`Consuming events with routing key: ${routingKey} on queue: ${uniqueQueueName}`);
};
module.exports = {connectToRabbitMQ, publishEvent, consumeEvent};