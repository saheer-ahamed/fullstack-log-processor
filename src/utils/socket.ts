import { Server } from "socket.io";

let io: Server | null = null;

export function getIO() {
    if (!io) {
        throw new Error("Socket.IO instance not initialized");
    }
    return io;
}

export function initIO(server: any) {
    if (!io) {
        io = new Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });
    }
    return io;
} 