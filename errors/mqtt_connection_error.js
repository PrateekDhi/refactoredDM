const ApplicationError = require("./application_error");

module.exports = class MqttConnectionError extends ApplicationError{
    constructor(){
        super("MQTT connection error occured",'mongo_connection_error', 500, 5153);
    }
}