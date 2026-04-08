const {TicketRepository} = require('../repository/index.js');
const {transport} = require('../config/emailConfig.js');
const {EMAIL_ID} = require('../config/serverConfig.js');
const {AppError} = require('./../utils/app-error.js');
const {StatusCodes} = require('http-status-codes');


class TicketService{
    constructor(){
        this.ticketRepo = new TicketRepository();
    }

    async _handleBookingSuccess(data){
        try{
            // 1. Create Immediate Confirmation Ticket
            await this.ticketRepo.createTicket({
                subject: "Booking Confirmed!",
                content: `Hi! Your booking for flight ${data.flightId} is successful. Total Cost: ${data.totalCost}`,
                recipientEmail: data.recipientEmail,
                notificationTime: new Date(), // NOW
                status: 'PENDING'
            });

            // 2. Create Delayed Check-in Reminder Ticket (48 hours before departure)
            const departureTime = new Date(data.departureTime);
            const reminderTime = new Date(departureTime.getTime() - (48 * 60 * 60 * 1000));

            await this.ticketRepo.createTicket({
                subject: "Reminder: Web Check-in is Open",
                content: `Your flight ${data.flightId} departs in 48 hours. Please complete your check-in.`,
                recipientEmail: data.recipientEmail,
                notificationTime: reminderTime, // 48 Hours before departure
                status: 'PENDING'
            });

            console.log("Successfully created two notification tasks for booking.");
        }catch(error){
            throw error;
        }
    }

    async sendMail(mailData){
        try{
            const response = await transport.sendMail({
                from : EMAIL_ID,
                to : mailData.recipientEmail,
                subject : mailData.subject,
                text : mailData.content
            })
            //console.log("Email sent:", response.response); // debug log
            return response;
        }catch(error){
            console.log("error in sending email",error);
            throw error;
        }
    }

    //Logic to process the RabbitMQ payload and create the required tickets
    async subscribeEvents(payload){
        try{
            const {data,service} = payload; //destructuring , we send like this in booking service
            switch(service){
                case 'CREATE_TICKET' : 
                    await this._handleBookingSuccess(data);
                    break;
                default :
                    throw new AppError('Invalid service come from Booking',StatusCodes.BAD_REQUEST);
            }
        }catch(error){
            throw error;
        }
    }

    async createTicket(data){
        try{
            const response = await this.ticketRepo.createTicket(data);
            return response;
        }catch(error){
            console.log("error in creating ticket",error);
            throw error;
        }
    }
    async getTicket(ticketId){
        try{
            const response = await this.ticketRepo.getTicket(ticketId);
            return response;
        }catch(error){
            console.log("error in getting ticket",error);
            throw error;
        }
    }
    async getPendingTickets(){
        try{
            const response = await this.ticketRepo.getPendingTickets();
            return response;
        }catch(error){
            console.log("error in getting pending tickets",error);
            throw error;
        }
    }

    async updateTicket(ticketId,data){
        try{
            const response = await this.ticketRepo.updateTicket(ticketId,data);
            return response;
        }catch(error){
            console.log("error in updating ticket",error);
            throw error;
        }
    }
    async destroyTicket(ticketId){
        try{
            const response = await this.ticketRepo.destroyTicket(ticketId);
            return response;
        }catch(error){
            console.log("error in deleting ticket",error);
            throw error;
        }
    }

}

module.exports = TicketService;

