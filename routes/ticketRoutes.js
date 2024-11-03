const express = require("express");
const TicketsController = require("../controllers/ticketController");

const router = express.Router();

router.get("/", TicketsController.getTicketData);
router.get("/:service", TicketsController.getTicketDataPerService);
router.post("/issue", TicketsController.issueNewTicket);
router.post("/call", TicketsController.callNextTicket);
router.post("/startService/:service", TicketsController.startService);
router.delete("/leaveQueue/:service/:ticket", TicketsController.leaveQueue);
router.delete("/finishService/:service", TicketsController.finishService);

module.exports = router;
