// const validationMiddleware = require('../middlewares/validationMiddleware');
const c = require('../utils/handlers/controller');
const checkTokenAuthentication = require('../auth/UserAuthentication');
const authorize = require('../auth/UserAuthorization');
const validationMiddleware = require('../middlewares/requestValidation');
const stringifiedObjectParser = require('../middlewares/stringifiedObjectParser');

//Controllers
const automationController = require('../controllers/automation');

//Helpers
const Roles = require('../utils/helpers/roles');

//Errors
// const definedErrors = require('../errors');
// const ApplicationError = definedErrors.ApplicationError;

module.exports = (router, app) => {
    router.post('/changeAutomationActivationStatus',
    checkTokenAuthentication, 
    authorize([Roles.Owner, Roles.Member], res.locals.groupId, res.locals.userId),
    validationMiddleware, 
    c(automationController.changeAutomationActivationStatus, (req, res, next) => [req.body.automationId, req.body.activationStatus,
        res.locals.userId
    ]));

    router.post('/createTimeBasedAutomation',
    checkTokenAuthentication,
    authorize([Roles.Owner, Roles.Member], req.body.groupId, res.locals.userId),
    stringifiedObjectParser,
    validationMiddleware,
    c(automationController.createTimeBasedAutomation,(req, res, next) => [req.body.groupId, req.body.automationName, 
        req.body.triggerTime, req.body.triggerWeekDays, req.body.allUsersAccess, req.body.deviceId, req.body.actions, 
        req.body.sceneId, req.body.triggerDate, res.locals.userId
    ]));

    router.post('/updateTimeBasedAutomation',
    checkTokenAuthentication,
    authorize([Roles.Owner, Roles.Member], req.body.groupId, res.locals.userId),
    stringifiedObjectParser,
    validationMiddleware,
    c(automationController.updateTimeBasedAutomation, (req, res, next) => [req.body.groupId, req.body.automationId,
        req.body.automationName,req.body.triggerTime, req.body.triggerWeekDays, req.body.deviceId, req.body.actions, 
        req.body.sceneId, req.body.triggerDate, res.locals.userId
    ]));

    router.post('/createConditionBasedAutomation',
    checkTokenAuthentication,
    authorize([Roles.Owner, Roles.Member], req.body.groupId, res.locals.userId),
    stringifiedObjectParser,
    validationMiddleware,
    c(automationController.createConditionBasedAutomation, (req, res, next) => [req.body.groupId, req.body.automationName,
        req.body.triggerDeviceId, req.body.triggerDeviceDataType, req.body.triggerDeviceValue, req.body.triggerDeviceCondition, 
        req.body.allUsersAccess, req.body.deviceId, req.body.actions, req.body.sceneId, req.body.notify, res.locals.userId
    ]));

    router.post('/updateConditionBasedAutomation',
    checkTokenAuthentication,
    authorize([Roles.Owner, Roles.Member], req.body.groupId, res.locals.userId),
    stringifiedObjectParser,
    validationMiddleware,
    c(automationController.updateConditionBasedAutomation, (req, res, next) => [req.body.groupId, req.body.automationId,
        req.body.automationName, req.body.triggerDeviceId, req.body.triggerDeviceDataType, req.body.triggerDeviceValue, 
        req.body.triggerDeviceCondition, req.body.allUsersAccess, req.body.deviceId, req.body.actions, req.body.sceneId,
        res.locals.userId
    ]));

    router.post('/deleteAutomation',
    checkTokenAuthentication,
    authorize([Roles.Owner], req.body.groupId, res.locals.userId),
    validationMiddleware,
    c(automationController.deleteAutomation, (req, res, next) => [req.body.groupId, req.body.automationId, 
        res.locals.userId
    ]));

    router.post('/fetchAutomationData',
    checkTokenAuthentication,
    authorize([Roles.Owner, Roles.Member], res.locals.groupId, res.locals.userId),
    validationMiddleware,
    c(automationController.fetchAutomationData, (req, res, next) => [req.body.automationId, res.locals.userId]));

    router.post('/changeAutomationApprovalStatus',
    checkTokenAuthentication,
    authorize([Roles.Owner], req.body.groupId, res.locals.userId),
    validationMiddleware,
    c(automationController.changeAutomationApprovalStatus, (req, res, next) => [req.body.groupId, req.body.automationId, 
        req.body.approvalStatus, res.locals.userId
    ]));

    router.post('/fetchAutomationByDevicesAndScenes',
    checkTokenAuthentication,
    authorize([Roles.Owner, Roles.Member], req.body.groupId, res.locals.userId),
    validationMiddleware,
    c(automationController.fetchAutomationByDevicesAndScenes, (req, res, next) => [req.body.groupId, req.body.deviceIds, 
        req.body.sceneIds, res.locals.userId
    ]));

    return router
}