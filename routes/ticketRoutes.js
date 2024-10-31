const express = require("express");
const TicketsController = require("../controllers/ticketController");

const router = express.Router();

router.get("/", TicketsController.getTicketData);
router.get("/:service", TicketsController.getTicketDataPerService);
router.post("/issue", TicketsController.issueNewTicket);
router.post("/call", TicketsController.callNextTicket);
router.post("/leaveQueue/:service", TicketsController.leaveQueue);
router.delete("/finishService/:service", TicketsController.finishService);
router.post("/startService/:service", TicketsController.startService);

module.exports = router;
