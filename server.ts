import next from "next";
import { createServer } from "http";
import { parse } from "url";
import { initIO } from "./src/utils/socket";

// Setup Next.js
const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// Create HTTP server
const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true)
    handle(req, res, parsedUrl)
});

// Initialize Socket.io
const io = initIO(server);

// Handle socket connections
io.on("connection", (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log(`❌ Client disconnected: ${socket.id}`);
    });
});

// Initialize the application
const startServer = async () => {
    try {
        // Prepare Next.js
        await app.prepare();
        
        // Start the server
        server.listen(port, () => {
            console.log(`🚀 Server is running on port ${port}`);
            console.log(`👷 Worker is ready to process jobs`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();

import "./src/utils/workers/logWorker";
