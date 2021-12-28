// const validationMiddleware = require('../middlewares/validationMiddleware');
const c = require('../utils/handlers/controller');

//Services


//Response model
const Response = require('../utils/response');

//Errors
const definedErrors = require('../errors');
const ApplicationError = definedErrors.ApplicationError;

module.exports = (router, app) => {
    // router.post('/changeAutomationActivationStatus',checkTokenAuthorization, validationMiddleware,restrictedController.changeAutomationActivationStatus);
    // router.post('/createTimeBasedAutomation',checkTokenAuthorization,requestBodyArrayParsing,validationMiddleware,restrictedController.createTimeBasedAutomation);
    // router.post('/updateTimeBasedAutomation',checkTokenAuthorization,requestBodyArrayParsing,validationMiddleware,restrictedController.updateTimeBasedAutomation);
    // router.post('/createConditionBasedAutomation',checkTokenAuthorization,requestBodyArrayParsing,validationMiddleware, restrictedController.createConditionBasedAutomation);
    // router.post('/updateConditionBasedAutomation',checkTokenAuthorization,requestBodyArrayParsing,validationMiddleware, restrictedController.updateConditionBasedAutomation);
    // router.post('/deleteAutomation',checkTokenAuthorization,validationMiddleware,restrictedController.deleteAutomation);
    // router.post('/fetchAutomationData',checkTokenAuthorization,validationMiddleware,restrictedController.fetchAutomationData);
    // router.post('/changeAutomationApprovalStatus',checkTokenAuthorization,validationMiddleware,restrictedController.changeAutomationApprovalStatus);

    // router.post('/fetchAutomationByDevicesAndScenes',checkTokenAuthorization,requestBodyArrayParsing,validationMiddleware,restrictedController.fetchAutomationByDevicesAndScenes);

    return router
}