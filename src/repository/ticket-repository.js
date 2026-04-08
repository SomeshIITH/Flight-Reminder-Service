const {Ticket} = require('./../models/index');
const {Op} = require('sequelize');


class TicketRepository{
    constructor(){
        this.ticket = Ticket;
    }

    async createTicket(data){
        try{
            const response = await this.ticket.create(data);
            return response;
        }catch(error){
            console.log("error in creating ticket",error);
            throw error;
        }
    }

    async getTicket(ticketId){
        try{
            const response = await this.ticket.findByPk(ticketId);
            return response;
        }catch(error){
            console.log("error in getting ticket",error);
            throw error;
        }
    }
    async getPendingTickets() {
        try {
            const tickets = await this.ticket.findAll({
                where: {
                    status: 'PENDING',
                    notificationTime: {
                        [Op.lte]: new Date() 
                    }
                }
            });
            return tickets;
        } catch (error) {
            console.error("Repository Error [getPendingTickets]:", error);
            throw error;
        }
    }
    async updateTicket(ticketId,data){
        try{
            const ticket = await this.ticket.findByPk(ticketId);
            if (!ticket) {
                throw new Error("Ticket not found");
            }
            if(data.status)ticket.status = data.status;
            if(data.notificationTime) ticket.notificationTime = data.notificationTime;
            await ticket.save();
            return ticket;
        }catch(error){
            console.log("error in updating ticket",error);
            throw error;
        }
    }

    async destroyTicket(ticketId){
        try{
            const response = await this.ticket.destroy({
                where : {
                    id : ticketId
                }
            });
            return response;
        }catch(error){
            console.log("error in deleting ticket",error);
            throw error;
        }
    }

}

module.exports = TicketRepository;