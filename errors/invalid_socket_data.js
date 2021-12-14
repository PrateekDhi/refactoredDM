const ApplicationError = require("./application_error");

module.exports = class InvalidSocketData extends ApplicationError{
    constructor(){
        super("Invalid socket data",'invalid_socket_data', 400, 4571);
    }
}