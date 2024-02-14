import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import Ably from 'ably';


const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('dist'));
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const ably = new Ably.Realtime(ABLY_API_KEY); // Access API key from environment variable

io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit('disconnect');
        });
    });

    socket.on('JOIN', ({ roomId, username }) => {
        socket.join(roomId);
        const channel = ably.channels.get(roomId);
        channel.presence.enter({ clientId: socket.id, data: username });
    });

    socket.on('CODE_CHANGE', ({ roomId, code }) => {
        socket.in(roomId).emit('CODE_CHANGE', { code });
    });

    socket.on('SYNC_CODE', ({ socketId, code }) => {
        const channel = ably.channels.get(socketId);
        channel.publish('CODE_CHANGE', { code });
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Listen on ${PORT}`));
