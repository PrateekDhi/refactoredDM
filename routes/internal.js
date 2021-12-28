// const validationMiddleware = require('../middlewares/validationMiddleware');
const c = require('../utils/handlers/controller');

//Services


//Response model
const Response = require('../utils/response');

//Errors
const definedErrors = require('../errors');
const ApplicationError = definedErrors.ApplicationError;

module.exports = (router, app) => {
    // router.use(authenticateInternalRequest);
    // router.post('/userGeneralDataChange', internalController.userGeneralDataChange);
    // router.post('/userProfileDataChange', internalController.userProfileDataChange);
    // router.post('/userDefaultNotificationSettings', internalController.userDefaultNotificationSettings);
    // router.post('/userProfilePhotoChange', internalController.userProfilePhotoChange);

    return router
}