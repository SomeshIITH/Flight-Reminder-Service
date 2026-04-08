const {TicketService} = require('./../service/index.js');
const {StatusCodes} = require('http-status-codes');
const {EMAIL_ID} = require('./../config/serverConfig.js');
const ticketService = new TicketService();

const create = async (req,res,next) => {
    try{
        const ticket = await ticketService.createTicket(req.body);
        return res.status(StatusCodes.ACCEPTED).json({
            data : ticket,
            success : true,
            message : "Ticket created successfully",
            err : {}
        })
    }catch(error){
        next(error);
    }
}

const get = async (req,res,next) => {
    try{
        const ticket = await ticketService.getTicket(req.params.id);
        return res.status(StatusCodes.ACCEPTED).json({
            data : ticket,
            success : true,
            message : "Ticket fetched successfully",
            err : {}
        })
    }catch(error){
        next(error);
    }
}


const update = async (req,res,next) => {
    try{
        const ticket = await ticketService.updateTicket(req.params.id,req.body);
        return res.status(StatusCodes.ACCEPTED).json({
            data : ticket,
            success : true,
            message : "Ticket updated successfully",
            err : {}
        })
    }catch(error){
       next(error);
    }
}

const destroy = async (req,res,next) => {
    try{
        const ticket = await ticketService.destroyTicket(req.params.id);
        return res.status(StatusCodes.ACCEPTED).json({
            data : ticket,
            success : true,
            message : "Ticket deleted successfully",
            err : {}
        })
    }catch(error){
        next(error);
    }
}

const sendMail = async (req,res,next)=>{
    try{
        const response = await ticketService.sendMail(req.body);
        return res.status(StatusCodes.ACCEPTED).json({
            data : response,
            success : true,
            message : "Email sent successfully",
            err : {}
        })
    }catch(error){
        next(error);
    }
}

module.exports = {
    create,
    get,
    update,
    destroy,
    sendMail
}