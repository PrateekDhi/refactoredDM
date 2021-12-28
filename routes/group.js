// const validationMiddleware = require('../middlewares/validationMiddleware');
const c = require('../utils/handlers/controller');

//Services


//Response model
const Response = require('../utils/response');

//Errors
const definedErrors = require('../errors');
const ApplicationError = definedErrors.ApplicationError;

module.exports = (router, app) => {
    // router.post('/createGroup',checkTokenAuthorization,validationMiddleware,restrictedController.createGroup);
    // router.post('/createGroupV2',checkTokenAuthorization,requestBodyArrayParsing,validationMiddleware,restrictedController.createGroupV2);
    // router.post('/updateGroupDetails',checkTokenAuthorization,validationMiddleware,restrictedController.updateGroupDetails);
    // router.post('/deleteGroup',checkTokenAuthorization,validationMiddleware,restrictedController.deleteGroup);
    // router.post('/transferGroupRequest',checkTokenAuthorization,validationMiddleware,restrictedController.transferGroupRequest);
    // router.post('/fetchGroups',checkTokenAuthorization,restrictedController.fetchGroups);
    // router.post('/generateGroupInvitationCode', checkTokenAuthorization, validationMiddleware, restrictedController.generateGroupInvitationCode);
    // router.post('/fetchGroupInvitationCodeAndUrl',checkTokenAuthorization,validationMiddleware,restrictedController.fetchGroupInvitationCodeAndUrl);
    // router.post('/deleteGroupInvitationCode',checkTokenAuthorization,validationMiddleware,restrictedController.deleteGroupInvitationCode);
    //     // router.post('/deleteGroupV2',checkTokenAuthorization, restrictedController.deleteGroupV2);
    // router.post('/deleteGroupV3',checkTokenAuthorization,requestBodyArrayParsing,validationMiddleware,restrictedController.deleteGroupV3);

    return router
}