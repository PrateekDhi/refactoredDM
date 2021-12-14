const ApplicationError = require("./application_error");

module.exports = class IncorrectGroupId extends ApplicationError{
    constructor(){
        super("Incorrect group id",'incorrect_group_id', 401, 4567);
    }
}