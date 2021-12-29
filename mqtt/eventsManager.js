const cn = require('../utils/common');
const definedErrors = require('../errors');
const ApplicationError = definedErrors.ApplicationError;
// const inventoryService = require('../services/inventory');
// const deviceService = require('../services/device');
// const deviceConfigurationService = require('../services/deviceConfiguration')
const errorHandler = require('../utils/handlers/error');

//Cannot use arrow function due to the context of 'this' wont be the socket instance in arrow function

//TODO: If we could some how get the name of the event which was triggered inside the event handler with 'this' we can replace all the exported function with simply specific event functions
//this.eventNames() gives an array of all the events which cannot be used for this

exports.messageEvent = function(topic, payload){
    console.log('Message from mqtt now', topic, payload);
    if(![2,3].includes(topic.split('/').length)){
        const caughtError = new definedErrors.InvalidMqttTopic();
        caughtError.setMessage("Invalid MQTT Topic");
        caughtError.setAdditionalDetails("Topic - " + topic);
        caughtError.setType('info');
        return errorHandler.handleError(caughtError);
    }
    if(payload == null){
        const caughtError = new definedErrors.InvalidMqttPayloadError();
        caughtError.setMessage("Empty payload received from MQTT Topic");
        caughtError.setAdditionalDetails("Topic - " + topic);
        caughtError.setType('info');
        return errorHandler.handleError(caughtError);
    }
    Promise.all([
        inventoryService.checkDeviceTopicValidity(topic.split("/")[0]+"/"+topic.split("/")[1]),
        deviceService.checkTopicOnboardedDevice(topic.split("/")[0]+"/"+topic.split("/")[1])
    ])
    .then(checkResults => {
        if(!checkResults[0]) {
            const caughtError = new definedErrors.IncorrectDeviceTopic();
            caughtError.setMessage("Device with this topic does not exist in the database");
            caughtError.setAdditionalDetails("Topic - " + topic);
            caughtError.setType('info');
            throw caughtError;
        }
        return Promise.all([cn.parseAsync(message.toString()),checkResults[1]])
    })
    .then(([parsedData, checkResult]) => {
        if(topic.split("/").length === 2){  //Message from device primary topic, TODO: Add "pub" and "sub" denotes its a publishing topic
            if(!checkResult){
                deviceService.getDeviceIdFromTopic(topic.split("/")[1],parsedData)
                .then(deviceId => deviceConfigurationService.getConfigurationStatus(deviceId))
                .then(deviceConfigurationStatus => {
                    
                })
            }else{

            }
        }else{ //Message from device feature topic and "pub" denotes its a publishing topic
            if(!checkResult){
                const caughtError = new definedErrors.NonOnboardedDeviceSendingMQTTMessage();
                caughtError.setMessage("Device with this topic is not onboarded, should not be sending data");
                caughtError.setAdditionalDetails("Topic - " + topic + "Payload - " + parsedData);
                caughtError.setType('warning');
                throw caughtError;
            }

        }
    }).catch(error => {
        if(error instanceof ApplicationError) return errorHandler.handleError(error);
        let caughtError;
        //TODO: Handle the error of failed JSON parsing and handle it separately as invalid payload error
        caughtError = new definedErrors.InternalServerError();
        caughtError.setMessage("Internal server error on mqtt message event");
        caughtError.setAdditionalDetails(error);
        return errorHandler.handleError(error);
    })
}

exports.disconnectEvent = function(packet){
    const caughtError = new definedErrors.MqttConnectionError();
    caughtError.setMessage("Disconnected from mqtt");
    caughtError.setAdditionalDetails(packet);
    caughtError.setType('fatal')
    errorHandler.handleError(caughtError);
    // console.log('Disconnected from mqtt, Packet received -',packet); //TODO: Use Logger
}

exports.reconnectEvent = function(){ //TODO: Use Logger
    console.log('Reconnecting to mqtt now')
}

exports.closeEvent = function(data){ //TODO: Use Logger
    // console.log('Closed mqtt connection',data)
    const caughtError = new definedErrors.MqttConnectionError();
    caughtError.setMessage("MQTT connection closed");
    caughtError.setAdditionalDetails(data);
    caughtError.setType('fatal')
    errorHandler.handleError(caughtError);
}