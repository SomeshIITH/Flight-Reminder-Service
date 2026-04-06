const cron = require('node-cron');
const { TicketService } = require('./../service/index');
const { EMAIL_ID } = require('./../config/serverConfig');

const emailService = new TicketService();

const setupCronJob = async () => {
    cron.schedule('*/2 * * * *', async () => {
        console.log('running a task every 2 minute');

        try {
            const tickets = await emailService.getAllTicket({ status: "PENDING" });

            for (const ticket of tickets) {
                console.log(ticket);
                try {
                    await emailService.sendEmail(
                        EMAIL_ID,
                        ticket.recepientEmail,
                        ticket.subject,
                        ticket.content
                    );

                    await emailService.updateTicket(ticket.id, { status: "SUCCESS" });

                } catch (error) {
                    console.log("Email failed for ticket:", ticket.id);

                    await emailService.updateTicket(ticket.id, { status: "FAILED" });
                }
            }

        } catch (error) {
            console.log("Cron job error:", error.message);
        }
    });
};

module.exports = setupCronJob;