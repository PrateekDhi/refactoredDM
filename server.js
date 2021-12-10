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

const config = require('./config');
const {socket} = require('./socket/index.js');
socket(server);

//Mongo DB
const mongoConnect = require('./utils/databases/mongo').mongoConnect;

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
const internalRoutes = require('./routes/internal')(express.Router(), app);
const undefinedRoutes = require('./routes/undefined');

// const restrictedAreaRoutes = require('./routes/restrictedAreaRoutes')(express.Router(), app, restrictedAreaController);
// const {createMySqlPool} = require('./database/mysql')
// const {initializeFCMConnection} = require('./controllers/fcm')
const handlingErrorsMiddleware =  require('./middlewares/error');
const errorHandler = require('./utils/handlers/error');
require('express-async-errors')

// get the unhandled rejection and throw it to another fallback handler we already have.
process.on('unhandledRejection', (reason, promise) => {
    throw reason;
});
    
process.on('uncaughtException', (error) => {
    errorHandler.handleError(error);
    if (!errorHandler.isTrustedError(error)) {
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
app.use('/restricted', notificationRoutes);
app.use('/restricted', socketIORoutes);
app.use('/internal', internalRoutes);

app.use(undefinedRoutes);
app.use(handlingErrorsMiddleware);

mongoConnect(() => {
    server.listen(config.app.port, config.app.ip, () => {
        console.log("\x1b[32m",'IP - '+config.app.ip+ ',Port - '+config.app.port);
    });
    console.log("-------");
    socketIO.initializeSocketIOConnection(io)
    startMqttConnection().then(async (status) => {
        if(status == 1) console.log("\x1b[32m",'Connected to MQTT server');
        else if(status == 0) console.log("\x1b[31m", 'Failed to connect to MQTT server');
        console.log("\x1b[37m");
    }).catch((err) => setImmediate(() => {console.log("\x1b[31m",'Could not connect to MQTT server, error - %s',err)}));
    // initializeFCMConnection().then(async () => {
    //     console.log("\x1b[32m",'Initialized FCM connection');
    // }).catch((err) => setImmediate(() => {console.log("\x1b[31m",'Could not initialize FCM connection, error - %s',err)}));
    startTimeBasedSceneControl().then(async () => {
        console.log("\x1b[32m",'Started time based scene handler');
    }).catch((err) => setImmediate(() => {console.log("\x1b[31m",'Could not start time based scene handler, error - %s',err)}));
}).catch(err => {console.log("Mongo Connection error", err)});  //TODO: Use logger utility

module.exports = {
  app
}
