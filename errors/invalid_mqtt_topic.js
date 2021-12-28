const ApplicationError = require("./application_error");

module.exports = class InvalidMqttTopic extends ApplicationError{
    constructor(){
        super("Invalid MQTT Topic",'invalid_mqtt_topic', 400, 4344);
    }
}