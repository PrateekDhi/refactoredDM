 // const validationMiddleware = require('../middlewares/validationMiddleware');
const c = require('../utils/handlers/controller');
// const {socketService} = require('../socket'); //FOR SOCKET CONNECTION TESTING

//Services


//Response model
const Response = require('../utils/response');

//Errors
const definedErrors = require('../errors');
const ApplicationError = definedErrors.ApplicationError;

module.exports = (router, app) => {
    // router.post('/getSubscriptionPlansList',checkTokenAuthorization,restrictedController.getSubscriptionPlansList);
    // router.post('/startPayment',checkTokenAuthorization, restrictedController.startPayment);
    // router.post('/startUserPlan',checkTokenAuthorization,restrictedController.startUserPlan);
    // router.post('/addNewDeveloperController',restrictedController.addNewDeveloperController);
    // router.post('/addDevicesToDeveloperController',restrictedController.addDevicesToDeveloperController);

    return router
}
    