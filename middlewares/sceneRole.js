const sceneService = require('../services/scene');

//Errors
const definedError = require('../errors');
const ApplicationError = definedError.ApplicationError;

module.exports = (req, res, next) => {
    if(!req.body.sceneId){
        const caughtError = definedError.FieldsMissing();
        caughtError.setAdditionalDetails("Scene id not provided in request body for scene role check middleware");
        return next(caughtError);
    }
    sceneService.getUserRoleForScene(req.body.sceneId, res.locals.userId)
    .then(userRole => {
        if(userRole === 'creator') res.locals.isSceneCreator = true;
        else res.locals.isSceneCreator = false;
        return next();
    })
    .catch(error => {
        if(error instanceof ApplicationError) return next(error);
        const caughtError = definedError.InternalServerError();
        caughtError.setAdditionalDetails(error);
        return next(caughtError);
    })
}