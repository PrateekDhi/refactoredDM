const cn = require('../utils/common');
const definedErrors = require('../errors');
const groupService = require('../services/group');
const categoryService = require('../services/category');
const errorHandler = require('../utils/handlers/error');

//Cannot use arrow function due to the context of 'this' wont be the socket instance in arrow function

//TODO: If we could some how get the name of the event which was triggered inside the event handler with 'this' we can replace all the exported function with simply specific event functions
//this.eventNames() gives an array of all the events which cannot be used for this

exports.messageEvent = function(topic, payload){
    console.log('Message from mqtt now', topic, payload);
}

exports.disconnectEvent = function(packet){
    console.log('Disconnected from mqtt, Packet received -',packet); //TODO: Use Logger
}

exports.reconnectEvent = function(){ //TODO: Use Logger
    // console.log('Reconnecting to mqtt now',data)
}

exports.closeEvent = function(data){ //TODO: Use Logger
    // console.log('Closed mqtt connection',data)
}
