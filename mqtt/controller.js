/**
 *
 * file - controller.js - The controller for mqtt module
 *
 * @author     Prateek Shukla
 * @version    0.1.0
 * @created    10/11/2021
 * @copyright  Dhi Technologies
 * @license    For use by Dhi Technologies applications
 *
 * @description - Controller handler is the primary file for the mqtt module. The backend server mqtt client is initialized using this file.
 * The file also handles the control flow of the mqtt module. 
 *
 * 28/12/2021 - PS - Created
 * 
**/

//Dependencies
const mqtt = require('mqtt');
const { cli } = require('winston/lib/winston/config');

//Local dependencies
const config = require('../config');
const cn = require('../utils/common');
const eventsManager = require('./eventsManager');

//Services
const mqttService = require('./service');

//Constants
const MQTT_LINK = config.mqtt_server_client.link;
const MQTT_OPTIONS = config.mqtt_server_client.options;
const MQTT_SERVER_CONNECTION_STATUS_TOPIC = "serverStatus";
const MQTT_SERVER_SUCCESSFULL_CONNECTION_MESSAGE = "Server connected to mqtt";
const MQTT_SERVER_STARTUP_TEST_MESSAGE = "Server connected";

let client;

module.exports = () => {
    return new Promise((resolve, reject) => {
        let runCount = 0;
        let connectionFlag = 0;
        let connectionError = "Unknown Error";
        client = mqtt.connect(MQTT_LINK, MQTT_OPTIONS);


        client.on('connect', () => {
            const connectionMessageOptions = {
                "qos":2,
                "retain":true
            }

            connectionFlag = 1;

            // mqttService.setClient(client);

            client.publish(MQTT_SERVER_CONNECTION_STATUS_TOPIC, MQTT_SERVER_SUCCESSFULL_CONNECTION_MESSAGE,connectionMessageOptions,function(err){
                if(err){
                    console.log("MQTT server error while publishing server connection status - "+err);
                }else{
                    console.log("Server connection status published to MQTT server")
                }
            })

            client.subscribe('#');
        });
        client.on('message', eventsManager.messageEvent);
        client.on('error', (error) => {
            if(error) connectionError = error;
            if(connectionFlag === 1) console.log('Error in MQTT Connection, Error - ', error || "Unknown Error"); //TODO: Use Logger
        });
        client.on('disconnect', eventsManager.disconnectEvent);
        client.on('reconnect', eventsManager.reconnectEvent);
        client.on('close', eventsManager.closeEvent);

        const runConnectionCheck = () => {
            if(runCount < 5){
                if(connectionFlag === 1) return resolve({"status":"success", "message":"Connected to MQTT."});
                else setTimeout(runConnectionCheck, 1000);
            }else return reject({"status":"failed", "error":`Failed to connect to MQTT within 5 seconds, Error - ${connectionError.message}`});
            runCount++;
        }
        setTimeout(runConnectionCheck, 100);
    })
}

