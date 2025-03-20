import next from "next";
import { createServer } from "http";
import { parse } from "url";
import { Server } from "socket.io";
import { Redis } from "ioredis";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// Create HTTP server
const server = createServer((req, res) => {
  const parsedUrl = parse(req.url!, true);
  handle(req, res, parsedUrl);
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Redis connection for pub/sub
const redisSub = new Redis({
  host: process.env.REDIS_HOST || "redis",
  port: Number(process.env.REDIS_PORT || "6379"),
  maxRetriesPerRequest: null,
});

// Subscribe to job progress updates
redisSub.subscribe("job-progress-channel", (err: any) => {
  if (err) {
    console.error("Failed to subscribe to Redis channel:", err);
  } else {
    console.log("Subscribed to job-progress-channel");
  }
});

redisSub.on("message", (channel: string, message: string) => {
  if (channel === "job-progress-channel") {
    const { result } = JSON.parse(message);
    io.emit("job-progress", { result });
  }
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Initialize the application
const startServer = async () => {
  try {
    await app.prepare();

    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log(`Worker is ready to process jobs`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

import "./src/utils/workers/logWorker";
