const automationService = require('../services/automation');

//Errors
const definedError = require('../errors');
const ApplicationError = definedError.ApplicationError;

module.exports = (req, res, next) => {
    if(!req.body.automationId){
        const caughtError = definedError.FieldsMissing();
        caughtError.setAdditionalDetails("Automation id not provided in request body for automation role check middleware");
        return next(caughtError);
    }
    automationService.getUserRoleForAutomation(req.body.automationId, res.locals.userId)
    .then(userRole => {
        if(userRole === 'creator') res.locals.isAutomationCreator = true;
        else res.locals.isAutomationCreator = false;
        return next();
    })
    .catch(error => {
        if(error instanceof ApplicationError) return next(error);
        const caughtError = definedError.InternalServerError();
        caughtError.setAdditionalDetails(error);
        return next(caughtError);
    })
}