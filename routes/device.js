// const validationMiddleware = require('../middlewares/validationMiddleware');
const c = require('../utils/handlers/controller');

//Services


//Response model
const Response = require('../utils/response');

//Errors
const definedErrors = require('../errors');
const ApplicationError = definedErrors.ApplicationError;

module.exports = (router, app) => {
    // router.post('/validateConfigurationKeyFromDevice',requestBodyParsingMiddleware,validationMiddleware, deviceController.validateConfigurationKeyFromDevice);
    
    return router
}