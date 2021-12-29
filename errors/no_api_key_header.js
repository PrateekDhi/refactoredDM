const ApplicationError = require("./application_error");

module.exports = class NoApiKeyHeader extends ApplicationError{
    constructor(){
        super("Unauthorized request: no api key given",'no_api_key_header', 401, 4151);
    }
}