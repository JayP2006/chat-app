const { Server } = require('socket.io');
const http = require('http');
const express = require('express');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ['https://chat-app-yjfi.vercel.app/'],
        methods: ['GET','POST']
    }
});

const userSocketmap = {};

const getreceiverid = (receiverId) => {
    return userSocketmap[receiverId];
};

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId !== "undefined") {
        userSocketmap[userId] = socket.id;
    }

    io.emit("getonlineusers", Object.keys(userSocketmap));

    socket.on('disconnect', () => {
        delete userSocketmap[userId];
        io.emit('getonlineusers', Object.keys(userSocketmap));
    });
});

module.exports = {
    app,
    io,
    server,
    getreceiverid  // ✅ Now this is properly exported
};
