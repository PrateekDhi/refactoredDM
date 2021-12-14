const { Server } = require('socket.io');
//TODO: import logger
const verifySocketConnection = require('./verify');
const eventsManager = require('./eventsManager');
const socketService = require('./service');
const definedErrors = require('../errors');
const errorHandler = require('../utils/handlers/error');

let io;
let sockets = {};

// const { ALLOWLIST_HOSTS, REDIS_PORT, REDIS_HOST } = config;

module.exports = app => {
    io = new Server(app, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["Authorization","authorization"],
            credentials: true
        }
    })
    //TODO: Log ('Socketio initialised!');
    socketService.setIO(io);

    //TODO: Error handling middleware for socket io
    io
    .use(verifySocketConnection)
    .on('connection', socket => {
        if (!sockets[socket.handshake.userId]) {
            sockets[socket.handshake.userId] = [];
            sockets[socket.handshake.userId].push({ "token": socket.handshake.headers['authorization'].split(" ")[1], "socketId": socket.id, "socket": socket });
        } else sockets[socket.handshake.userId].push({ "token": socket.handshake.headers['authorization'].split(" ")[1], "socketId": socket.id, "socket": socket });
        socket.join("elementDeletion:" + socket.handshake.userId);

        socket.on('groupList', eventsManager.groupListEvent);
        socket.on('favouriteDevicesList', eventsManager.favouriteDevicesListEvent);
        socket.on('groupScenes', eventsManager.groupScenesEvent);
        socket.on('groupAutomations', eventsManager.groupAutomationsEvent);
        socket.on('groupDevices', eventsManager.groupDevicesEvent);
        socket.on('groupMembers', eventsManager.groupMembersEvent);
        socket.on('groupCategories', eventsManager.groupCategoriesEvent);
        socket.on('categorisedDevices', eventsManager.categorisedDevicesEvent);
        socket.on('disconnect', async error => {
            //TODO: Log error
            let caughtError = new definedErrors.SocketDisconnectionError();
            sockets[socket.handshake.userId]
            .splice(sockets[socket.handshake.userId]
                .map(el => el.socketId)
                .indexOf(socket.id), 1);
            if (sockets[socket.handshake.userId].length == 0) delete sockets[socket.handshake.userId];
            caughtError.setAdditionalDetails(error);
            caughtError.setType('info');
            await errorHandler.handleError(caughtError);
        });
    })
}