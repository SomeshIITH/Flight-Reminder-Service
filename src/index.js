const express = require('express');
const bodyParser = require('body-parser');
const {PORT,REMINDER_BINDING_KEY} = require('./config/serverConfig.js');
const globalErrorHandler = require('./middlewares/error-handler.js');
// const db = require('./models/index.js');
const setupCronJob = require('./utils/job.js');
const {createChannel,subscribeMessage} = require('./utils/message-queue');

const {TicketService} = require('./service/index')
const ticketService = new TicketService();

const apiRoutes = require('./routes/index.js');



const SetupServer = async () => {
    const app = express();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use('/api' , apiRoutes);
    app.use(globalErrorHandler);

    app.listen(PORT,async () => {
        // console.log(PORT);
        console.log(`Server is running on http://localhost:${PORT}`);
        // / 1. Initialize the RabbitMQ Channel
        const channel = await createChannel();
        // 2. Start Subscribing to events from Booking Service
        subscribeMessage(channel, ticketService.subscribeEvents.bind(ticketService), REMINDER_BINDING_KEY);

        // 3. Start the Cron Job to process the Task Queue
        setupCronJob();
        
        console.log("Message Broker connected and Cron Job started.");
        
    })
}

SetupServer();
