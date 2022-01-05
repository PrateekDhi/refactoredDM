// const validationMiddleware = require('../middlewares/validationMiddleware');
const c = require('../utils/handlers/controller');
const checkTokenAuthorization = require('../authorization/UserAuthentication');
const validationMiddleware = require('../middlewares/requestValidation');
const stringifiedObjectParser = require('../middlewares/stringifiedObjectParser');

//Controllers
const automationController = require('../controllers/automation');

//Errors
// const definedErrors = require('../errors');
// const ApplicationError = definedErrors.ApplicationError;

module.exports = (router, app) => {
    router.post('/changeAutomationActivationStatus',
    // checkTokenAuthorization, 
    validationMiddleware, 
    c(automationController.changeAutomationActivationStatus, (req, res, next) => [req.body.automationId, req.body.activationStatus,
        res.locals.userId
    ]));

    router.post('/createTimeBasedAutomation',
    checkTokenAuthorization,
    stringifiedObjectParser,
    validationMiddleware,
    c(automationController.createTimeBasedAutomation,(req, res, next) => [req.body.groupId, req.body.automationName, 
        req.body.triggerTime, req.body.triggerWeekDays, req.body.allUsersAccess, req.body.deviceId, req.body.actions, 
        req.body.sceneId, req.body.triggerDate, res.locals.userId
    ]));

    router.post('/updateTimeBasedAutomation',
    checkTokenAuthorization,
    stringifiedObjectParser,
    validationMiddleware,
    c(automationController.updateTimeBasedAutomation, (req, res, next) => [req.body.groupId, req.body.automationId,
        req.body.automationName,req.body.triggerTime, req.body.triggerWeekDays, req.body.deviceId, req.body.actions, 
        req.body.sceneId, req.body.triggerDate, res.locals.userId
    ]));

    router.post('/createConditionBasedAutomation',
    checkTokenAuthorization,
    stringifiedObjectParser,
    validationMiddleware,
    c(automationController.createConditionBasedAutomation, (req, res, next) => [req.body.groupId, req.body.automationName,
        req.body.triggerDeviceId, req.body.triggerDeviceDataType, req.body.triggerDeviceValue, req.body.triggerDeviceCondition, 
        req.body.allUsersAccess, req.body.deviceId, req.body.actions, req.body.sceneId, req.body.notify, res.locals.userId
    ]));

    router.post('/updateConditionBasedAutomation',
    checkTokenAuthorization,
    stringifiedObjectParser,
    validationMiddleware,
    c(automationController.updateConditionBasedAutomation, (req, res, next) => [req.body.groupId, req.body.automationId,
        req.body.automationName, req.body.triggerDeviceId, req.body.triggerDeviceDataType, req.body.triggerDeviceValue, 
        req.body.triggerDeviceCondition, req.body.allUsersAccess, req.body.deviceId, req.body.actions, req.body.sceneId,
        res.locals.userId
    ]));

    router.post('/deleteAutomation',
    checkTokenAuthorization,
    validationMiddleware,
    c(automationController.deleteAutomation, (req, res, next) => [req.body.groupId, req.body.automationId, 
        res.locals.userId
    ]));

    router.post('/fetchAutomationData',
    checkTokenAuthorization,
    validationMiddleware,
    c(automationController.fetchAutomationData, (req, res, next) => [req.body.automationId, res.locals.userId]));

    router.post('/changeAutomationApprovalStatus',
    checkTokenAuthorization,
    validationMiddleware,
    c(automationController.changeAutomationApprovalStatus, (req, res, next) => [req.body.groupId, req.body.automationId, 
        req.body.approvalStatus, res.locals.userId
    ]));

    router.post('/fetchAutomationByDevicesAndScenes',
    checkTokenAuthorization,
    validationMiddleware,
    c(automationController.fetchAutomationByDevicesAndScenes, (req, res, next) => [req.body.groupId, req.body.deviceIds, 
        req.body.sceneIds, res.locals.userId
    ]));

    return router
}