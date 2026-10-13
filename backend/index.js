const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" },
});

app.use(express.json());

let latestData = {
  gps: "9.0765, 7.3986",
  temperature: 36.8,
  heartbeat: 74,
  bloodVolumePulse: 88,
  motion: "Resting",
  voice: "Stable"
};

app.post("/api/sensors", (req, res) => {
  const { gps, temperature, heartbeat, bloodVolumePulse, motion, voice } = req.body;

  latestData = {
    gps,
    temperature,
    heartbeat,
    bloodVolumePulse,
    motion,
    voice
  };

  io.emit("sensorUpdate", latestData);
  res.status(200).json({ status: "success", data: latestData });
});

app.get("/api/sensors", (req, res) => {
  res.status(200).json(latestData);
});

// WebSocket connection
io.on("connection", (socket) => {
  console.log("[Medical Telemetry] Clinician monitor connected:", socket.id);

  // Send latest telemetry immediately when client connects
  socket.emit("sensorUpdate", latestData);

  socket.on("disconnect", () => {
    console.log("[Medical Telemetry] Clinician monitor disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`[MediPulse Server] Clinical Vitals Service running on port ${PORT}`);
});
