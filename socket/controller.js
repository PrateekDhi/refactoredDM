const { Server } = require('socket.io');
//TODO: import logger
const verifySocketConnection = require('./auth');
const roomManager = require('./roomManager');

// const { ALLOWLIST_HOSTS, REDIS_PORT, REDIS_HOST } = config;

module.exports = app => {
    const io = new Server(app, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["Authorization","authorization"],
            credentials: true
        }
    })

    //TODO: Log ('Socketio initialised!');

    io
    .use(verifySocketConnection)
    .on('connection', socket => {
        if (!sockets[socket.handshake.userId]) {
            sockets[socket.handshake.userId] = [];
            sockets[socket.handshake.userId].push({ "token": socket.handshake.headers['authorization'].split(" ")[1], "socketId": socket.id, "socket": socket });
        } else sockets[socket.handshake.userId].push({ "token": socket.handshake.headers['authorization'].split(" ")[1], "socketId": socket.id, "socket": socket });
    })
}