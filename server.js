const express = require("express");
const cors = require("cors");
const axios = require("axios");
const WebSocket = require("ws");

const app = express();
const PORT = process.env.PORT || 5001;
let esp32Ip = "";
let esp32Status = "";

let publicIp = process.env.PUBLIC_IP;

const corsOptions = {
  origin: ["https://air-control.swansondev.me", "http://localhost:5173"], // Added localhost for development
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.use(express.json());

const wss = new WebSocket.Server({ noServer: true });

wss.on("connection", (ws) => {
  console.log("WebSocket connection established with ESP32.");
  ws.on("message", (message) => {
    console.log(`Received message from ESP32: ${message}`);
    esp32Status = message;
  });
});

app.post("/register", (req, res) => {
  const { ip } = req.body;
  if (ip) {
    esp32Ip = ip;
    console.log(`ESP32 registered with IP: ${esp32Ip}`);
    res.send({ message: "ESP32 registered successfully." });
  } else {
    res.status(400).send({ error: "IP address is required." });
  }
});

let sensorData = [{}]; // Initialize the array with an empty object

app.post("/sensor-data", (req, res) => {
  const { temp, hum, co2, voc } = req.body; // Destructure the incoming JSON data

  if (
    temp !== undefined &&
    hum !== undefined &&
    co2 !== undefined &&
    voc !== undefined
  ) {
    // Update the first element in the sensorData array
    sensorData[0] = {
      temp,
      hum,
      co2,
      voc,
      timestamp: new Date(), // Update timestamp with the current date
    };

    console.log("Received sensor data:", sensorData[0]); // Log the updated data for verification
    res.send({ message: "Data received successfully." });
  } else {
    res.status(400).send({
      error: "Temperature, humidity, CO2, and VOC are required.",
    });
  }
});

app.get("/sensor-data", (req, res) => {
  // This endpoint does not require a registered ESP32 IP.
  // It simply returns the latest sensor data if available.
  if (sensorData.length > 0) {
    res.send(sensorData[0]); // Send the first object from the sensorData array
  } else {
    res.status(404).send({ error: "No sensor data available." });
  }
});

app.get("/:command", async (req, res) => {
  const { command } = req.params;
  console.log(`Received command: ${command} for IP: ${esp32Ip}`);
  if (esp32Ip) {
    try {
      const response = await axios.get(`http://${publicIp}:8080/${command}`);
      console.log(`Response from ESP32: ${response.data}`);
      res.send(response.data);
    } catch (error) {
      console.error(`Error forwarding command to ESP32: ${error}`);
      res.status(500).send({ error: "Failed to send command to ESP32." });
    }
  } else {
    console.error("ESP32 IP is not registered.");
    res.status(400).send({ error: "ESP32 IP is not registered." });
  }
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});
