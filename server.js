// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let users = [];

io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);

    users.push(socket);

    if (users.length >= 2) {
        const [user1, user2] = users.splice(0, 2);
        user1.partner = user2;
        user2.partner = user1;
        user1.emit('chat-start');
        user2.emit('chat-start');
    }

    socket.on('send-message', (message) => {
        if (socket.partner) {
            socket.partner.emit('receive-message', message);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        users = users.filter(user => user !== socket);
        if (socket.partner) {
            socket.partner.emit('partner-disconnected');
            socket.partner.partner = null;
            users.push(socket.partner);
        }
    });

    socket.on('end-chat', () => {
        if (socket.partner) {
            socket.partner.emit('chat-ended');
            socket.partner.partner = null;
            socket.partner = null;
        }
    });

    socket.on('find-next', () => {
        if (socket.partner) {
            socket.partner.emit('chat-ended');
            socket.partner.partner = null;
            users.push(socket.partner);
        }
        users.push(socket);
        if (users.length >= 2) {
            const [user1, user2] = users.splice(0, 2);
            user1.partner = user2;
            user2.partner = user1;
            user1.emit('chat-start');
            user2.emit('chat-start');
        }
    });
});

app.use(express.static('public'));

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
