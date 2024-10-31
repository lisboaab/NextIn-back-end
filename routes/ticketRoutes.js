const express = require('express');
const TicketsController = require("../controllers/ticketController");

const router = express.Router();

router.get('/', TicketsController.getTicketData);          // Get all ticket data
router.get('/:service', TicketsController.getTicketDataPerService);  // Get ticket data per service
router.post('/issue', TicketsController.issueNewTicket);   // Issue a new ticket
router.post('/call', TicketsController.callNextTicket);    // Call the next ticket
router.post('/leaveQueue/:service', TicketsController.leaveQueue);    // Leave the queue
router.delete("/finishService/:service", TicketsController.finishService);
router.post("/startService/:service", TicketsController.startService);

module.exports = router;
