const express = require('express');
const router = express.Router();
//add routing logic
const {TicketController} = require('./../../controllers/index.js');

router.post('/tickets',TicketController.create);
router.get('/tickets/:id',TicketController.get);
router.get('/tickets',TicketController.getAll);
router.patch('/tickets/:id',TicketController.update);
router.delete('/tickets/:id',TicketController.destroy);
router.post('/email',TicketController.sendEmail);

module.exports = router;