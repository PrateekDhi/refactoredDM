// const validationMiddleware = require('../middlewares/validationMiddleware');
const c = require('../utils/handlers/controller');

//Services


//Response model
const Response = require('../utils/response');

//Errors
const definedErrors = require('../errors');
const ApplicationError = definedErrors.ApplicationError;

module.exports = (router, app) => {
    // router.post('/createGroupNote',checkTokenAuthorization,validationMiddleware,restrictedController.createGroupNote);
    // router.post('/updateGroupNote',checkTokenAuthorization,validationMiddleware,restrictedController.updateGroupNote);
    // router.post('/fetchGroupNotes',checkTokenAuthorization,validationMiddleware,restrictedController.fetchGroupNotes);
    // router.post('/fetchNoteById',checkTokenAuthorization,validationMiddleware,restrictedController.fetchNoteById);
    // router.post('/deleteGroupNote',checkTokenAuthorization,validationMiddleware,restrictedController.deleteGroupNote);

    return router
}