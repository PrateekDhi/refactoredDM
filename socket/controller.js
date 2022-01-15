/**
 *
 * file - controller.js - The controller for socket module
 *
 * @author     Nikita Kriplani
 * @version    0.1.0
 * @created    10/11/2021
 * @copyright  Dhi Technologies
 * @license    For use by Dhi Technologies applications
 *
 * @description - Controller handler is the primary file for the socket module. The socket service is initialized using this file.
 * The file also handles the control flow of the socket module. use of middleware using the use functionality and the declaration of various events
 * in this module. Also it handles the disconnection of socket connections
 *
 *
 * Unknown    - NK - Created
 * 13/12/2021 - PS - Updated
 * 
**/

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
        socket.on('disconnect', error => {
            //TODO: Log error
            let caughtError = new definedErrors.SocketDisconnectionError();
            sockets[socket.handshake.userId]
            .splice(sockets[socket.handshake.userId]
                .map(el => el.socketId)
                .indexOf(socket.id), 1);
            if (sockets[socket.handshake.userId].length == 0) delete sockets[socket.handshake.userId];
            caughtError.setAdditionalDetails(error);
            caughtError.setType('info');
            errorHandler.handleError(caughtError);
        });
    })
}