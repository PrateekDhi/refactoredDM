// const validationMiddleware = require('../middlewares/validationMiddleware');
const c = require('../utils/handlers/controller');

//Services


//Response model
const Response = require('../utils/response');

//Errors
const definedErrors = require('../errors');
const ApplicationError = definedErrors.ApplicationError;

module.exports = (router, app) => {
    // router.post('/fetchUserNotifications',checkTokenAuthorization,restrictedController.fetchUserNotifications);
    // router.post('/v2/fetchUserNotifications',checkTokenAuthorization,validationMiddleware,restrictedController.v2fetchUserNotifications);
    // router.post('/updateUserNotificationSettings',checkTokenAuthorization, restrictedController.updateUserNotificationSettings);

    // router.post('/viewedNotificationsList',checkTokenAuthorization, restrictedController.viewedNotificationsList);

    return router
}