const { Server } = require('socket.io');
//TODO: import logger
const verifySocketConnection = require('./auth');
const eventsManager = require('./eventsManager');

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
        socket.join("elementDeletion:" + socket.handshake.userId);

        socket.on('groupList', eventsManager.groupListEvent);
        socket.on('favouriteDevicesList', eventsManager.favouriteDevicesListEvent);
        socket.on('groupScenes', eventsManager.groupScenesEvent);
        socket.on('groupAutomations', eventsManager.groupAutomationsEvent);
        socket.on('groupDevices', eventsManager.groupDevicesEvent);
        socket.on('groupMembers', eventsManager.groupMembersEvent);
        socket.on('groupCategories', eventsManager.groupCategoriesEvent);
        socket.on('categorisedDevices', eventsManager.categorisedDevicesEvent);
        socket.on('disconnect', data => {
            sockets[socket.handshake.userId]
            .splice(sockets[socket.handshake.userId]
                .map(el => el.socketId)
                .indexOf(socket.id), 1);
            if (sockets[socket.handshake.userId].length == 0) delete sockets[socket.handshake.userId];
        });
    })
}