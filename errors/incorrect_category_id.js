const ApplicationError = require("./application_error");

module.exports = class IncorrectCategoryId extends ApplicationError{
    constructor(){
        super("Incorrect category id",'incorrect_category_id', 401, 4568);
    }
}