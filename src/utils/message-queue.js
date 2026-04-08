const amqplib = require('amqplib');
const { MESSAGE_BROKER_URL, EXCHANGE_NAME,QUEUE_NAME} = require('../config/serverConfig');


console.log(QUEUE_NAME , typeof QUEUE_NAME);

let connection = null;

const createChannel = async()=>{
    try{
        if (!connection) {
            connection = await amqplib.connect(MESSAGE_BROKER_URL);
        }
        const channel = await connection.createChannel();
        await channel.assertExchange(EXCHANGE_NAME,'direct',false);
        return channel;
    }catch(error){
        throw error;
    }
}

const publishMessage = async(channel,binding_key,message)=>{
    try{
        await channel.assertQueue(QUEUE_NAME);
        await channel.publish(EXCHANGE_NAME,binding_key,Buffer.from(message));
    }catch(error){
        throw error;
    }
}

const subscribeMessage = async(channel,service,binding_key)=>{
    try{
        const applicationQueue = await channel.assertQueue(QUEUE_NAME);
        channel.bindQueue(applicationQueue.queue,EXCHANGE_NAME,binding_key);

        channel.consume(applicationQueue.queue,msg=>{
            console.log('recieved data');
            console.log(msg.content.toString());
            const payload = JSON.parse(msg.content.toString());
            service.subsribeEvents(payload);
            // service(payload);
            channel.ack(msg);//acknowledge
        })
    }catch(error){
        throw error;
    }
}

module.exports = {
    createChannel, publishMessage , subscribeMessage
}


// const amqplib = require('amqplib');
// const { MESSAGE_BROKER_URL, EXCHANGE_NAME } = require('../config/serverConfig');

// let connection = null;

// /**
//  * Create / reuse connection and return channel
//  */
// const createChannel = async () => {
//     try {
//         if (!connection) {
//             connection = await amqplib.connect(MESSAGE_BROKER_URL);
//             console.log("RabbitMQ connected");
//         }

//         const channel = await connection.createChannel();

//         await channel.assertExchange(EXCHANGE_NAME, 'direct', {
//             durable: true
//         });

//         return channel;

//     } catch (error) {
//         console.log("Error creating channel:", error.message);
//         throw error;
//     }
// };

// /**
//  * Producer: send message to exchange
//  */
// const publishMessage = async (channel, bindingKey, message) => {
//     try {
//         channel.publish(
//             EXCHANGE_NAME,
//             bindingKey,
//             Buffer.from(JSON.stringify(message)),
//             {
//                 persistent: true
//             }
//         );

//         console.log(`Message sent with key: ${bindingKey}`);

//     } catch (error) {
//         console.log("Error publishing message:", error.message);
//         throw error;
//     }
// };

// /**
//  * Consumer: listen to queue and process messages
//  */
// const subscribeMessage = async (channel, service, bindingKey, queueName) => {
//     try {
//         // create queue
//         const appQueue = await channel.assertQueue(queueName, {
//             durable: true
//         });

//         // bind queue to exchange
//         await channel.bindQueue(
//             appQueue.queue,
//             EXCHANGE_NAME,
//             bindingKey
//         );

//         // control parallel processing , only max 10 messages
//         channel.prefetch(10);

//         console.log(`Waiting for messages on ${queueName}...`);

//         // consume messages
//         channel.consume(appQueue.queue, async (msg) => {
//             if (msg) {
//                 const data = msg.content.toString();
//                 console.log("Received:", data);

//                 const payload = JSON.parse(data);

//                 try {
//                     await service(payload);  // your business logic
//                     channel.ack(msg);        // success → remove message
//                 } catch (error) {
//                     console.log("Processing failed:", error.message);

//                     // reject message (can be sent to DLQ if configured)
//                     channel.nack(msg, false, false);
//                 }
//             }
//         });

//     } catch (error) {
//         console.log("Error subscribing:", error.message);
//         throw error;
//     }
// };

// module.exports = {
//     createChannel,
//     publishMessage,
//     subscribeMessage
// };