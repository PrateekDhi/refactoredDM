// const validationMiddleware = require('../middlewares/validationMiddleware');
const c = require('../utils/handlers/controller');

//Services


//Response model
const Response = require('../utils/response');

//Errors
const definedErrors = require('../errors');
const ApplicationError = definedErrors.ApplicationError;

module.exports = (router, app) => {
    // router.post('/addUserToGroupRequest',checkTokenAuthorization,validationMiddleware,restrictedController.addUserToGroupRequest);
    // router.post('/removeUserFromGroup',checkTokenAuthorization,validationMiddleware,restrictedController.removeUserFromGroup);
    // router.post('/fetchGroupUsers',checkTokenAuthorization,validationMiddleware,restrictedController.fetchGroupUsers);
    // router.post('/addUserToGroupViaInvitationCode', checkTokenAuthorization, validationMiddleware,restrictedController.addUserToGroupViaInvitationCode);
    // router.post('/addUserToGroupViaInvitationCodeV2', checkTokenAuthorization, validationMiddleware,restrictedController.addUserToGroupViaInvitationCodeV2);

    return router
}