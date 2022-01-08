const dotenv = require('dotenv');
dotenv.config();

const path = require('path');
const express = require('express')
const bodyParser = require('body-parser')
const app = express();
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const server = require('http').createServer(app);

const {initializeMQTTClient} = require('./mqtt');

const config = require('./config');
const definedErrors = require('./errors');
const ApplicationError = definedErrors.ApplicationError;
const {socket} = require('./socket');
socket(server);

//Mongo DB
const mongoConnect = require('./utils/databases/mongo').mongoConnect;

//APP DB
const {initiateMySqlPool} = require('./utils/databases/mysql');

//Routes Import
const groupRoutes = require('./routes/group')(express.Router(), app);
const categoryRoutes = require('./routes/category')(express.Router(), app);
const deviceManagementRoutes = require('./routes/deviceManagement')(express.Router(), app);
const sceneRoutes = require('./routes/scene')(express.Router(), app);
const automationRoutes = require('./routes/automation')(express.Router(), app);
const noteRoutes = require('./routes/note')(express.Router(), app);
const notificationRoutes = require('./routes/notification')(express.Router(), app);
const socketIORoutes = require('./routes/socketio')(express.Router(), app);
const deviceRoutes = require('./routes/device')(express.Router(), app);
const groupUserRoutes = require('./routes/groupUser')(express.Router(), app);
const subscriptionRoutes = require('./routes/subscription')(express.Router(), app);
const internalRoutes = require('./routes/internal')(express.Router(), app);
const undefinedRoutes = require('./routes/undefined');

// const restrictedAreaRoutes = require('./routes/restrictedAreaRoutes')(express.Router(), app, restrictedAreaController);
// const {createMySqlPool} = require('./database/mysql')
// const {initializeFCMConnection} = require('./controllers/fcm')
const socketMessaging = require('./middlewares/socketMessaging');
const handlingErrorsMiddleware =  require('./middlewares/error');
const errorHandler = require('./utils/handlers/error');
require('express-async-errors')

// get the unhandled rejection and throw it to another fallback handler we already have.
process.on('unhandledRejection', (reason, promise) => {
    throw reason;
});
    
process.on('uncaughtException', (error) => {
    console.log('eeeeeeeeeeee')
    errorHandler.handleError(error);
    if (!errorHandler.isTrustedError(error) || error.type == 'fatal') {
        process.exit(1);
    }
});

app.use(helmet());
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'uploads')))

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); //2nd parameter could also be used for restriction, for example - 'http://my-cool-page.com', but we barely want to narrow it down to one, Note - It will still work with tools like POSTMAN
    res.header(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-API-KEY'
    );
    if (req.method === 'OPTIONS') { //Browser sends an OPTIONS request first when we send a POST or PUT Request to check whether we can make that request
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET'); //Adding this header will let the browser know what METHODS it may send
        return res.status(200).json({}); //Since we dont need to process this request METHOD any further we simply send the response back at this stage itself
    }
    next();
});

app.use(cors())

app.use('/device', deviceRoutes);
app.use('/restricted', groupRoutes);
app.use('/restricted', categoryRoutes);
app.use('/restricted', deviceManagementRoutes);
app.use('/restricted', sceneRoutes);
app.use('/restricted', automationRoutes);
app.use('/restricted', noteRoutes);
app.use('/restricted', groupUserRoutes);
app.use('/restricted', subscriptionRoutes);
app.use('/restricted', notificationRoutes);
app.use('/restricted', socketIORoutes);
app.use('/internal', internalRoutes);

app.use(undefinedRoutes);
app.use(socketMessage)
app.use(handlingErrorsMiddleware);

try{
    mongoConnect(() => {
        console.log("\x1b[32m",'Mongo Database connected')
        initiateMySqlPool()
        .then(response => {
            if(response.status == 'success')console.log("\x1b[32m",'App Primary MySql Pool Initialized successfully')
            else console.log("\x1b[32m",'MySql Pool Initialization response - ', response);
            server.listen(config.app.port, config.app.ip, () => {
                console.log("\x1b[32m",'IP - '+config.app.ip+ ',Port - '+config.app.port);
            });
            //TODO: Add FCM Initialization and time based scene control
            // Promise.allSettled([
            //     initializeMQTTClient()
            // ])
            // .then(values => {
            //     if(values[0].status == 'fulfilled')console.log("\x1b[32m",'MQTT Client Initialization response - ', values[0].value);
            //     else console.log("\x1b[31m",'MQTT Client Initialization failed, reason - ', values[0].reason);
            // });
            // startMqttConnection().then(async (status) => {
            //     if(status == 1) console.log("\x1b[32m",'Connected to MQTT server');
            //     else if(status == 0) console.log("\x1b[31m", 'Failed to connect to MQTT server');
            //     console.log("\x1b[37m");
            // }).catch((err) => setImmediate(() => {console.log("\x1b[31m",'Could not connect to MQTT server, error - %s',err)}));
            // // initializeFCMConnection().then(async () => {
            // //     console.log("\x1b[32m",'Initialized FCM connection');
            // // }).catch((err) => setImmediate(() => {console.log("\x1b[31m",'Could not initialize FCM connection, error - %s',err)}));
            // startTimeBasedSceneControl().then(async () => {
            //     console.log("\x1b[32m",'Started time based scene handler');
            // }).catch((err) => setImmediate(() => {console.log("\x1b[31m",'Could not start time based scene handler, error - %s',err)}));
        })
        .catch(error => {
            const caughtError = new definedErrors.MysqlConnectionError();
            caughtError.setAdditionalDetails(error);
            caughtError.setType('fatal');
            throw caughtError;
        })
    })
}catch(err){
    if(err instanceof ApplicationError) errorHandler.handleError(err);
    else{
        const caughtError = new definedErrors.MongoConnectionError();
        caughtError.setAdditionalDetails(error);
        caughtError.setType('fatal');
        throw caughtError;
        // if (!errorHandler.isTrustedError(error)) {
        //     process.exit(1);
        // }
    }
    // console.log("\x1b[31m",'Could not connect to Mongo Database, error - %s',err)
}

module.exports = {
  app
}
