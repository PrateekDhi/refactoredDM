const ApplicationError = require("./application_error");

module.exports = class IncorrectDeviceTopic extends ApplicationError{
    constructor(){
        super("Incorrect Device Topic",'invalid_device_topic', 400, 4345);
    }
}