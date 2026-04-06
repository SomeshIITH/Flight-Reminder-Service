const cron = require('node-cron');
const {EmailService} = require('./../service/index');
const {EMAIL_ID} = require('./../config/serverConfig');

const setupCronJob = async () => {
    cron.schedule('*/5 * * * *', async () => {
        console.log('running a task every 5 minute');
        const tickets= await EmailService.getAllTicket({status : "PENDING"});
        for(const ticket of tickets){
            await EmailService.sendEmail({from : EMAIL_ID , to : ticket.recepientEmail, subject : ticket.subject, text : ticket.content});
            await EmailService.updateTicket(ticket.id,{status : "SUCCESS"});
        }
    });
}

module.exports = setupCronJob;