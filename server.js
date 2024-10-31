require("dotenv").config(); // read environment variables from .env file
const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT;
const host = process.env.HOST;

app.use(cors()); //enable ALL CORS requests (client requests from other domain)
app.use(express.json()); //enable parsing JSON body data

app.get("/", function (req, res) {
  res.status(200).json({ message: "home -- api" });
});

app.use('/tickets', require("./routes/ticketRoutes.js"));

app.all("*", function (req, res) {
  res.status(400).json({
    success: false,
    msg: `The API does not recognize the request on ${req.url}`,
  });
});

app.listen(port, () =>
  console.log(`App listening at http://${host}:${port}/`)
);