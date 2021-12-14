const ApplicationError = require("./application_error");

module.exports = class SocketDisconnectionError extends ApplicationError{
    constructor(){
        super("Socket disconnection",'socket_disconnected', 400, 4121);
    }
}