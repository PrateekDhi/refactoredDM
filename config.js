/**
 *
 * file - config.js - The main configuration file
 *
 * @version    0.1.0
 * @created    10/11/2021
 * @copyright  Dhi Technologies
 * @license    For use by dhi Technologies applications
 *
 * Description : This file's main purpose is to make sure that the values global 
 * values received are in the correct type when picked up from enviornment variables.
 *
 *
 * 16/11/2021 - PS - Created
 * 
**/
const {toBoolean} = require('./utils/common');

module.exports = {
    node_env: process.env.NODE_ENV,
    server_ip: process.env.HOST,
    server_port: process.env.PORT,
    app: {
        domainName:process.env.DOMAIN_NAME,
        serverIp:process.env.SERVER_IP,
        ip:process.env.IP,
        port: parseInt(process.env.PORT)
    },
    mqtt_server_client: {
        link: process.env.MQTT_SERVER_CLIENT_LINK,
        options: {
            clientId: process.env.MQTT_SERVER_CLIENT_ID,
            username: process.env.MQTT_SERVER_CLIENT_USERNAME,
            password: process.env.MQTT_SERVER_CLIENT_PASSWORD,
            will:{
                topic: process.env.MQTT_SERVER_CLIENT_WILL_TOPIC,
                payload: process.env.MQTT_SERVER_CLIENT_WILL_PAYLOAD,
                qos: parseInt(process.env.MQTT_SERVER_CLIENT_WILL_QOS),
                retain: process.env.MQTT_SERVER_CLIENT_WILL_RETAIN
            },
            keepalive: parseInt(process.env.MQTT_SERVER_CLIENT_KEEPALIVE),
            rejectUnauthorized: toBoolean(process.env.MQTT_SERVER_CLIENT_REJECT_UNAUTHORIZED),
            reconnectPeriod: parseInt(process.env.MQTT_SERVER_CLIENT_RECONNECTION_PERIOD) 
        }
    },
    mysql_db: {
        connectionLimit : parseInt(process.env.MYSQL_CONNECTION_LIMIT),
        host     : process.env.MYSQL_HOST,
        user     : process.env.MYSQL_USER,
        password : process.env.MYSQL_PASS,
        database : process.env.MYSQL_DB_NAME,
        debug    : process.env.MYSQL_DEBUG_OPTION,
        waitForConnections : process.env.MYSQL_WAIT_FOR_CONNECTIONS_OPTION,
        queueLimit : parseInt(process.env.MYSQL_QUEUE_LIMIT)
    },
    inventory_mysql_db: {
        connectionLimit : parseInt(process.env.INVENTORY_MYSQL_CONNECTION_LIMIT),
        host     : process.env.INVENTORY_MYSQL_HOST,
        user     : process.env.INVENTORY_MYSQL_USER,
        password : process.env.INVENTORY_MYSQL_PASS,
        database : process.env.INVENTORY_MYSQL_DB_NAME,
        debug    : process.env.INVENTORY_MYSQL_DEBUG_OPTION,
        waitForConnections : process.env.INVENTORY_MYSQL_WAIT_FOR_CONNECTIONS_OPTION,
        queueLimit : parseInt(process.env.INVENTORY_MYSQL_QUEUE_LIMIT)
    },
    mongo_db: {
        connection_string: process.env.MONGO_DB_CONNECTION_STRING,
        use_new_url_parser_setting: process.env.MONGO_USE_NEW_URL_PARSER_SETTING,
        use_unified_topology_setting: process.env.MONGO_USE_UNIFIED_TOPOLOGY_SETTING
    },
    mqtt_client_postgres_db: {
        host: MQTT_POSTGRES_HOST,
        port: MQTT_POSTGRES_PORT,
        user: MQTT_POSTGRES_USER,
        password: MQTT_POSTGRES_PASSWORD,
        database: MQTT_POSTGRES_DB_NAME
    },
    email_gateway_api_key: process.env.EMAIL_GATEWAY_API_KEY,
    sms_gateway:{
        user_name: process.env.SMS_GATEWAY_USERNAME,
        api_key: process.env.SMS_GATEWAY_API_KEY,
        sender_id: process.env.SMS_GATEWAY_SENDER_ID
    },
    payment_gateway:{
        hostname: process.env.PAYMENT_GATEWAY_HOSTNAME,
        path: process.env.PAYMENT_GATEWAY_PATH,
        client_id: process.env.PAYMENT_GATEWAY_CLIENT_ID,
        client_secret: process.env.PAYMENT_GATEWAY_CLIENT_SECRET
    },
    iam_server_details:{
        protocol: process.env.IAM_SERVER_PROTOCOL,
        host: process.env.IAM_SERVER_HOST,
        port: process.env.IAM_SERVER_PORT,
        apiKey: process.env.IAM_SERVER_APIKEY
    },
    bcrypt:{
        password_salt_rounds: parseInt(process.env.PASSWORD_SALT_ROUNDS)
    },
    app_url: process.env.APP_URL,
    group_invitation_code_link:{
        path: process.env.GROUP_INVITATION_CODE_LINK_PATH,
        param_key: process.env.GROUP_INVITATION_CODE_LINK_PARAM_KEY
    }
}