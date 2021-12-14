const ApplicationError = require("./application_error");

module.exports = class IncorrectSocketIOToken extends ApplicationError{
    constructor(){
        super("Incorrect socket io token given",'incorrect_socketio_token', 401, 4579);
    }
}