const ApplicationError = require("./application_error");

module.exports = class GroupEntitiesMismatch extends ApplicationError{
    constructor(){
        super("Entities in the process do not belong to the same group",'group_entities_mismatch', 400, 4573);
    }
}