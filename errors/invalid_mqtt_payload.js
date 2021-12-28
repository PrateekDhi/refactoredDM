const ApplicationError = require("./application_error");

module.exports = class InvalidMqttPayload extends ApplicationError{
    constructor(){
        super("Invalid MQTT Payload",'invalid_mqtt_payload', 400, 4343);
    }
}