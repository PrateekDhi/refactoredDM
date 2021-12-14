const ApplicationError = require("./application_error");

module.exports = class SocketDisconnectionError extends ApplicationError{
    constructor(){
        super("Socket disconnection",'socket_disconnected', 500, 5110);
    }
}