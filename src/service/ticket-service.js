const {TicketRepository} = require('../repository/index.js');
const {transport} = require('../config/emailConfig.js')

class TicketService{
    constructor(){
        this.ticketrepo = new TicketRepository();
    }

    async sendEmail(from,to,subject,text){
        try{
            const response = await transport.sendMail({
                from : from,
                to : to,
                subject : subject,
                text : text
            })
            console.log("Email sent:", response.response); // debug log
            return response;
        }catch(error){
            console.log("error in sending email",error);
            throw error;
        }
    }
    async createTicket(ticket){
        try{
            const parsedDate = new Date(ticket.notificationTime);

            if (isNaN(parsedDate)) {
                throw new Error("Invalid notificationTime");
            }

            const data = {
                ...ticket,
                notificationTime: parsedDate.toISOString()
            };
    
            const response = await this.ticketrepo.createTicket(data);
            return response;
        }catch(error){
            console.log("error in creating ticket",error);
            throw error;
        }
    }

    async getTicket(ticketId){
        try{
            const response = await this.ticketrepo.getTicket(ticketId);
            return response;
        }catch(error){
            console.log("error in getting ticket",error);
            throw error;
        }
    }
    async getAllTicket(filter){
        try{
            const tickets = await this.ticketrepo.getAllTicket(filter);
            return tickets;
        }catch(error){
            console.log("error in getting all tickets",error);
            throw error;
        }
    }

    async updateTicket(ticketId,data){
        try{
            const response = await this.ticketrepo.updateTicket(ticketId,data);
            return response;
        }catch(error){
            console.log("error in updating ticket",error);
            throw error;
        }
    }
    async destroyTicket(ticketId){
        try{
            const response = await this.ticketrepo.destroyTicket(ticketId);
            return response;
        }catch(error){
            console.log("error in deleting ticket",error);
            throw error;
        }
    }

}

module.exports = TicketService;

