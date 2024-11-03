const {SerialPort} = require("serialport");
const fileService = require("../services/fileService.js");

const port = new SerialPort({ path: "COM3", baudRate: 9600 });

exports.getTicketData = async (req, res) => {
  try {
    const data = await fileService.loadData();
    res.json(data || { error: "No data available" });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve ticket data" });
  }
};

exports.getTicketDataPerService = async (req, res) => {
  try {
    const service = req.params.service;
    const data = await fileService.loadData();
    res.json(data[service] || { error: "No data available" });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve ticket data" });
  }
};

exports.issueNewTicket = async (req, res) => {
  try {
    const route = req.body.route;
    const data = await fileService.loadData();

    if (!data[route]) {
      data[route] = { currentTicket: 0, clients: [], lastTicket: 0 };
    }

    const newTicket = data[route].currentTicket + 1;
    data[route].currentTicket = newTicket;
    data[route].clients.push(newTicket);
    await fileService.saveData(data);

    res.json({ route, ticketNumber: newTicket });
  } catch (error) {
    res.status(500).json({ error: "Failed to issue new ticket" });
  }
};

exports.callNextTicket = async (req, res) => {
  try {
    const { route } = req.body;
    const data = await fileService.loadData();

    if (data[route] && data[route].clients.length > 0) {
      const nextTicket = data[route].clients.shift();
      data[route].lastTicket = nextTicket;
      await fileService.saveData(data);
      port.write(`${nextTicket}\n`);
      console.log(nextTicket);
      
      res.json({ route, nextTicket });
    } else {
      res.status(404).json({ error: "No clients in queue" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to call next ticket" });
  }
};

exports.leaveQueue = async (req, res) => {
  try {
    const service = req.params.service;
    const ticketNumber = Number(req.params.ticket);
    const data = await fileService.loadData();

    if (data[service] && data[service].clients.includes(ticketNumber)) {
      data[service].clients = data[service].clients.filter(
        (ticket) => ticket !== ticketNumber
      );
      await fileService.saveData(data);
      res.json({
        message: `Ticket ${ticketNumber} has left the queue for ${service}`,
      });
    } else {
      res.status(404).json({ error: "Ticket not found in queue" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to leave queue" });
  }
};

exports.finishService = async (req, res) => {
  try {
    const { service } = req.params;
    const data = await fileService.loadData();

    if (data[service]) {
      data[service].status = "closed";
      data[service].currentTicket = 0;
      await fileService.saveData(data);

      if (data[service].clients.length === 0) {
        data[service].clients = [];
        data[service].lastTicket = 0;
        res.json({
          status: "closed",
          message: `Service ${service} has been finished and no clients remain in the queue.`,
        });
      } else {
        res.json({
          status: "closed",
          message: `Service ${service} has been closed, but there are still clients in the queue.`,
        });
      }
    } else {
      res.status(404).json({ error: "Service not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to finish service" });
  }
};

exports.startService = async (req, res) => {
  try {
    const { service } = req.params;
    const data = await fileService.loadData();

    if (data[service].clients.length == 0) {
      data[service].currentTicket = 0;
      data[service].clients = [];
      data[service].lastTicket = 0;
      data[service].status = "open";
      await fileService.saveData(data);
      return res.json({
        status: "open",
        message: `Service ${service} has opened!`,
      });
    }

    return res.json({
      status: "closed",
      message: `You can't do that`,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to finish service" });
  }
};
