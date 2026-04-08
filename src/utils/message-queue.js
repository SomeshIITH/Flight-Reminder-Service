 
 const amqplib = require('amqplib');
 const {MESSAGE_BROKER_URL, EXCHANGE_NAME,QUEUE_NAME} = require('../config/serverConfig');
 
 // We maintain these as singletons to avoid resource exhaustion
 let connection = null;
 let channel = null;
 
 const createChannel = async()=>{
     try{
         if (!connection)connection = await amqplib.connect(MESSAGE_BROKER_URL);

         if(!channel){
             channel = await connection.createChannel();
             //  Ensure the Exchange exists (Durable: true keeps it alive after a restart)
             await channel.assertExchange(EXCHANGE_NAME,'direct',{durable: true});
         }
         return channel;
     }catch(error){
         console.error("RabbitMQ Error in createChannel:", error);
         throw error;
     }
 }
 
 const publishMessage = async(channel,binding_key,message)=>{
     try{
         await channel.assertQueue(QUEUE_NAME);
         // Publish with 'persistent: true' so the message survives a RabbitMQ crash/restart
        //  await channel.publish(EXCHANGE_NAME,binding_key,Buffer.from(message));
         await channel.publish(EXCHANGE_NAME,binding_key,Buffer.from(message),{persistent: true});
     }catch(error){
         console.error("RabbitMQ Error in publishMessage:", error); 
         throw error;
     }
 }
 
 const subscribeMessage = async(channel,service,binding_key)=>{
     try{
         const applicationQueue = await channel.assertQueue(QUEUE_NAME,{durable: true});
         channel.bindQueue(applicationQueue.queue,EXCHANGE_NAME,binding_key);
 
         channel.consume(applicationQueue.queue,msg=>{
             if(msg != null){
                // console.log('recieved data');
                // console.log(msg.content.toString());
                // const payload = JSON.parse(msg.content.toString());
                // service(payload);
                // channel.ack(msg);//acknowledge
                console.log('Received data in consumer');
                try {
                    const payload = JSON.parse(msg.content.toString());
                    service(payload);
                    // Acknowledge that the message was processed successfully
                    channel.ack(msg); 
                } catch (parseError) {
                    console.error("Error processing message payload:", parseError);
                    // If the message is corrupted, we reject it without requeuing
                    channel.nack(msg, false, false); 
                }
             }
         })
     }catch(error){
         console.error("RabbitMQ Error in subscribeMessage:", error);
         throw error;
     }
 }
 
 module.exports = {
     createChannel, publishMessage , subscribeMessage
 }
 