const ApplicationError = require("./application_error");

module.exports = class MongoConnectionError extends ApplicationError{
    constructor(){
        super("Mongo connection error occured",'mongo_connection_error', 500, 5152);
    }
}