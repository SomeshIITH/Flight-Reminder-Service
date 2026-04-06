const {NotificationTicket} = require('./../models/index');
const {Op} = require('sequelize');


class TicketRepository{
    constructor(){
        this.notificationTicket = NotificationTicket;
    }

    async createTicket(ticket){
        try{
            const response = await this.notificationTicket.create(ticket);
            return response;
        }catch(error){
            console.log("error in creating ticket",error);
            throw error;
        }
    }

    async getTicket(ticketTd){
        try{
            const response = await this.notificationTicket.finfdByPk(ticketTd);
            return response;
        }catch(error){
            console.log("error in getting ticket",error);
            throw error;
        }
    }
    async getAllTicket(filter){
        try{
            const tickets = await this.notificationTicket.finadAll({
                where : {
                    status : filter.status,
                    notificationTime : {
                        [Op.lte] : new Date()
                    }   
                }
            })
            return tickets;
        }catch(error){
            console.log("error in getting all tickets",error);
            throw error;
        }
    }
    async updateTicket(ticketId,data){
        try{
            const ticket = await this.notificationTicket.findByPk(ticketId);
            if(data.status)ticket.status = data.status;
            if(data.notificationTime)ticket.notificationTicket = data.notificationTime;
            await ticket.save();
            return ticket;
        }catch(error){
            console.log("error in updating ticket",error);
            throw error;
        }
    }

    async destroyTicket(ticketId){
        try{
            const response = await this.notificationTicket.destroy({
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