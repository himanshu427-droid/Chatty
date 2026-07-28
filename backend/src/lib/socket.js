import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
    },
    pingInterval: 25000,
    pingTimeout: 60000,
});

const userSocketMap = new Map();

export function getReceiverSocketId(userId) {
    const key = String(userId);
    const set = userSocketMap.get(key);
    return set ? Array.from(set).pop() : undefined;
}

function emitOnlineUsers() {
    io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
}

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.handshake?.auth?.userId || socket.handshake?.query?.userId;

    if (userId) {
        const uid = String(userId);
        const existing = userSocketMap.get(uid) || new Set();
        existing.add(socket.id);
        userSocketMap.set(uid, existing);
    }

    emitOnlineUsers();

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);

        for (const [uid, set] of userSocketMap.entries()) {
            if (set.has(socket.id)) {
                set.delete(socket.id);
                if (set.size === 0) userSocketMap.delete(uid);
                break;
            }
        }

        emitOnlineUsers();
    });
});

export default { io, server, app };