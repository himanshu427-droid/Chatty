import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
    },
    // sensible defaults for production
    pingInterval: 25000,
    pingTimeout: 60000,
});

// Map userId -> Set of socketIds (support multiple tabs/connections)
const userSocketMap = new Map();

export function getReceiverSocketId(userId) {
    const set = userSocketMap.get(userId);
    // return one socket id (prefer the latest)
    return set ? Array.from(set).pop() : undefined;
}

function emitOnlineUsers() {
    io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
}

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    // Prefer handshake.auth (used by modern socket.io clients) then fallback to query
    const userId = socket.handshake?.auth?.userId || socket.handshake?.query?.userId;

    if (userId) {
        const existing = userSocketMap.get(userId) || new Set();
        existing.add(socket.id);
        userSocketMap.set(userId, existing);
    }

    emitOnlineUsers();

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);

        // remove this socket id from whichever user set it belongs to
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