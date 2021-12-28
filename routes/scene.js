// const validationMiddleware = require('../middlewares/validationMiddleware');
const c = require('../utils/handlers/controller');

//Services


//Response model
const Response = require('../utils/response');

//Errors
const definedErrors = require('../errors');
const ApplicationError = definedErrors.ApplicationError;

module.exports = (router, app) => {
    // router.post('/createScene',checkTokenAuthorization, requestBodyArrayParsing,validationMiddleware,restrictedController.createScene);
    // router.post('/updateScene',checkTokenAuthorization,requestBodyArrayParsing,validationMiddleware, restrictedController.updateScene);
    // router.post('/deleteScene',checkTokenAuthorization,validationMiddleware,restrictedController.deleteScene);
    // router.post('/fetchGroupScenes',checkTokenAuthorization,validationMiddleware,restrictedController.fetchGroupScenes);
    // router.post('/v2/fetchGroupScenes',checkTokenAuthorization,validationMiddleware,restrictedController.fetchGroupScenesV2);
    // router.post('/fetchSceneData',checkTokenAuthorization,validationMiddleware,restrictedController.fetchSceneData);
    // router.post('/approveNewScene', checkTokenAuthorization,validationMiddleware, restrictedController.approveNewScene);

    // router.post('/fetchScenesByDevices',checkTokenAuthorization,requestBodyArrayParsing,validationMiddleware,restrictedController.fetchScenesByDevices);

    return router
}