const ApplicationError = require("./application_error");

module.exports = class NonOnboardedDeviceSendingMQTTMessage extends ApplicationError{
    constructor(){
        super("MQTT Message received from non onboarded device",'non_onboarded_device_sending_mqtt_message', 408, 4346);
    }
}