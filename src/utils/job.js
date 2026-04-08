const cron = require('node-cron');
const { TicketService } = require('./../service/index');
const ticketService = new TicketService();

const setupCronJob = async () => {
    cron.schedule('*/2 * * * *', async () => {
        console.log('running a task every 2 minute');

        try {
            const tickets = await ticketService.getPendingTickets();

            if(tickets.length === 0) {
                console.log("No pending tasks to process.");
                return;
            }

            for (const ticket of tickets) {
                try {
                    // 1. Attempt to send the email
                    await ticketService.sendMail({
                        recipientEmail: ticket.recipientEmail,
                        subject: ticket.subject,
                        content: ticket.content
                    });

                    // 2. Mark as SUCCESS on completion
                    await ticketService.updateTicket(ticket.id, { status: "SUCCESS" });
                    console.log(`Successfully processed ticket ID: ${ticket.id}`);

                } catch (error) {
                    console.error(`Failed to process ticket ID: ${ticket.id}. marking as FAILED.`);
                    // 4. Mark as FAILED so we can audit/retry later
                    await ticketService.updateTicket(ticket.id, { status: "FAILED" });
                }
            }

        } catch (error) {
            console.log("Cron job error:", error.message);
        }
    });
};

module.exports = setupCronJob;