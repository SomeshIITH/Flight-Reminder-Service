const {TicketService} = require('./../service/index.js');
const {StatusCodes} = require('http-status-codes');
const {EMAIL_ID} = require('./../config/serverConfig.js');
const ticketService = new TicketService();

const create = async (req,res) => {
    try{
        const ticket = await ticketService.createTicket(req.body);
        return res.status(StatusCodes.ACCEPTED).json({
            data : ticket,
            success : true,
            message : "Ticket created successfully",
            err : {}
        })
    }catch(error){
        return res.status(StatusCodes.BAD_REQUEST).json({
            data : {},
            success : false,
            message : "Error in creating ticket",
            err : {message : error.message , stack : error.stack}
        })
    }
}

const get = async (req,res) => {
    try{
        const ticket = await ticketService.getTicket(req.params.id);
        return res.status(StatusCodes.ACCEPTED).json({
            data : ticket,
            success : true,
            message : "Ticket fetched successfully",
            err : {}
        })
    }catch(error){
        return res.status(StatusCodes.BAD_REQUEST).json({
            data : {},
            success : false,
            message : "Error in getting ticket",
            err :{message : error.message , stack : error.stack}
        })
    }
}

const getAll = async (req,res) => {
    try{
        const tickets = await ticketService.getAllTicket(req.query);
        return res.status(StatusCodes.ACCEPTED).json({
            data : tickets,
            success : true,
            message : "Tickets fetched successfully",
            err : {}
        })
    }catch(error){
        return res.status(StatusCodes.BAD_REQUEST).json({
            data : {},
            success : false,
            message : "Error in getting tickets",
            err :{message : error.message , stack : error.stack}
        })
    }
}

const update = async (req,res) => {
    try{
        const ticket = await ticketService.updateTicket(req.params.id,req.body);
        return res.status(StatusCodes.ACCEPTED).json({
            data : ticket,
            success : true,
            message : "Ticket updated successfully",
            err : {}
        })
    }catch(error){
        return res.status(StatusCodes.BAD_REQUEST).json({
            data : {},
            success : false,
            message : "Error in updating ticket",
            err :{message : error.message , stack : error.stack}
        })
    }
}

const destroy = async (req,res) => {
    try{
        const ticket = await ticketService.destroyTicket(req.params.id);
        return res.status(StatusCodes.ACCEPTED).json({
            data : ticket,
            success : true,
            message : "Ticket deleted successfully",
            err : {}
        })
    }catch(error){
        return res.status(StatusCodes.BAD_REQUEST).json({
            data : {},
            success : false,
            message : "Error in deleting ticket",
            err : {message : error.message , stack : error.stack}
        })
    }
}

const sendEmail = async (req,res)=>{
    try{
        if(req.body.subject && req.body.content && req.body.recepientEmail && req.body.status && req.body.notificationTime){
            const payload = {
                from  : EMAIL_ID,
                to : req.body.recepientEmail,
                subject : req.body.subject,
                text : req.body.content
            }
            const response = await ticketService.sendEmail(payload);
            return res.status(StatusCodes.ACCEPTED).json({
                data : response,
                success : true,
                message : "Email sent successfully",
                err : {}
            });
        }
        else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                data : {},
                success : false,
                message : "Missing required fields",
                err : {}
            })
        }
    }catch(error){
        return res.status(StatusCodes.BAD_REQUEST).json({
            data : {},
            success : false,
            message : "Error in sending email",
            err :{message : error.message , stack : error.stack}
        })
    }
}

module.exports = {
    create,
    get,
    getAll,
    update,
    destroy,
    sendEmail
}