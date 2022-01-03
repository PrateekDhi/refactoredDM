const { body, oneOf, validationResult } = require('express-validator');

const definedErrors = require('../errors');
const ApplicationError = definedErrors.ApplicationError;

//Constant Validations (Used in multiple endpoints)
const GROUP_ID_DEFAULT_VALIDATION = body('groupId').isString().bail().notEmpty()
const DEVICE_ID_DEFAULT_VALIDATION = body('deviceId').isString().bail().notEmpty()
const AUTOMATION_NAME_DEFAULT_VALDATION = body('automationName').isString().bail().notEmpty()
const ALL_USERS_ACCESS_DEFAULT_VALIDATION = body('allUsersAccess').isBoolean().bail().notEmpty()
const GROUP_LATITUDE_DEFAULT_VALIDATION = oneOf([
    body('groupLatitude').isString().bail().notEmpty(),
    body('groupLatitude').isFloat().bail().notEmpty(),
])

const GROUP_LONGITUDE_DEFAULT_VALIDATION = oneOf([
    body('groupLongitude').isString().bail().notEmpty(),
    body('groupLongitude').isFloat().bail().notEmpty()
])

const ENDPOINTS = {
    addNewDevice:
        [

            GROUP_ID_DEFAULT_VALIDATION,
            body(['categoryId', 'configurationKey', 'deviceName']).isString().bail().notEmpty(),
            // body('categoryId').isString().notEmpty(),
            // body('configurationKey').isString().notEmpty(),
            // body('deviceName').isString().notEmpty(),
        ],
    addUserToGroupRequest:
        [
            body('groupId').optional().isString().bail().notEmpty(),
            body('email').optional().isEmail().bail().notEmpty()
        ],
    transferDevice:
        [
            body(['deviceId', 'transferGroupId', 'transferCategoryId']).isString().bail().notEmpty().trim()
            // body('transferGroupId').isString().trim().notEmpty(),
            // body('transferCategoryId').isString().trim().notEmpty()
        ],
    addUserToGroupViaInvitationCode:
        [
            body('code').isString().bail().notEmpty()
        ],
    addUserToGroupViaInvitationCodeV2:
        [
            body('code').isString().bail().notEmpty()
        ],
    changeAutomationActivationStatus:
        [
            body('automationId').isString().bail().notEmpty(),
            body('activationStatus').isString().bail().notEmpty()
        ],
    checkDeviceActivation:
        [
            body('configurationKey').optional().isString().bail().notEmpty()
        ],
    controlDevice:
        [
            body('deviceId').isString().bail().notEmpty(),
            body('actionType').isString().bail().notEmpty(),
            body('actionValue').isString().bail().notEmpty()
        ],
    createCategories:
        [
            GROUP_ID_DEFAULT_VALIDATION,
            body('categoryName.*').isString().bail().notEmpty()
        ],
    createCategory:
        [
            GROUP_ID_DEFAULT_VALIDATION,
            body('categoryName').isString().bail().notEmpty()
        ],
    createConditionBasedAutomation:
        [
            GROUP_ID_DEFAULT_VALIDATION,
            AUTOMATION_NAME_DEFAULT_VALDATION,
            body('triggerDeviceId').isString().bail().notEmpty(),
            body('triggerDeviceDataType').isString().bail().notEmpty(),
            body('triggerDeviceValue').isString().bail().notEmpty(),
            body('deviceId').optional().isString().bail().notEmpty(),
            body('actions').isArray().bail().optional().notEmpty(),
            body('actions.*.actionType').optional().isString().bail().notEmpty(),
            body('actions.*.actionValue').optional().isString().bail().notEmpty(),
            body('sceneId').optional().isString().bail().notEmpty(),
            body('triggerDeviceCondition').isString().bail().notEmpty(),
            body('allowUsersAccess').optional().isString().bail().notEmpty()
        ],
    createGroup:
        [
            body('groupName').isString().bail().notEmpty(),
            body('groupLatitude').optional().isString().bail().notEmpty(),
            body('groupLongitude').optional().isString().bail().notEmpty()
        ],
    createGroupV2:
        [
            body('groupName').isString().bail().notEmpty(),
            // groupLatitude,
            body('groupLatitude').isString().bail().toFloat().isFloat().bail().notEmpty(),
            body('groupLongitude').isString().bail().toFloat().isFloat().bail().notEmpty(),
            body('groupType').isString().bail().isIn(['container', 'property']).bail().notEmpty(),
            body('categoryNames').isArray().bail().notEmpty(),
            body('categoryNames.*').isString()
        ],
    createScene:
        [
            body('groupId').isString().bail().notEmpty(),
            body('sceneName').isString().bail().notEmpty(),
            body('sceneDevices').isArray().bail().notEmpty(),
            body('sceneDevices.*.deviceId').isString().bail().notEmpty(),
            body('sceneDevices.*.actionType').isString().bail().notEmpty(),
            body('sceneDevices.*.actionValue').isString().bail().notEmpty(),
            ALL_USERS_ACCESS_DEFAULT_VALIDATION
        ],
    approveNewScene:
        [
            body('groupId').isString().bail().notEmpty(),
            body('sceneId').isString().bail().notEmpty(),
            body('approvalStatus').isString().bail().notEmpty(),
        ],
    createTimeBasedAutomation:
        [
            GROUP_ID_DEFAULT_VALIDATION,
            AUTOMATION_NAME_DEFAULT_VALDATION,
            body('triggerTime').isString().bail().trim().notEmpty(),
            // body('triggerTime').custom((value,{req})=>validationMethods.customTriggerTimeValidation(value,{req})),
            body('triggerWeekDays').optional().isArray().bail().notEmpty(),
            ALL_USERS_ACCESS_DEFAULT_VALIDATION,
            body('deviceId').optional().notEmpty().bail().isString(),
            body('actions').isArray().bail().optional().notEmpty(),
            body('actions.*.actionType').optional().isString().bail().notEmpty(),
            body('actions.*.actionValue').optional().isString().bail().notEmpty(),
            body('sceneId').optional().isString().bail().notEmpty(),
            body('triggerDate').optional().isString().bail().notEmpty()
            // body('triggerDate').custom((value,{req})=>validationMethods.customTriggerDateValidation(value, {req}))
        ],
    deleteAutomation:
        [
            body('automationId').isString().bail().notEmpty(),
            body('groupId').isString().bail().notEmpty()
        ],
    createGroupNote:
        [
            body('groupId').isString().bail().notEmpty(),
            body('body').isString().bail().isLength({ min: 2, max: 280 }).bail().notEmpty()
        ],
    updateGroupNote:
        [
            body('noteId').isString().bail().notEmpty(),
            body('body').isString().bail().isLength({ min: 2, max: 280 }).bail().notEmpty()
        ],
    fetchGroupNotes:
        [
            body('limit').isString().bail().notEmpty(),
            body('offset').isString().bail().notEmpty(),
            body('groupId').isString().bail().notEmpty()
        ],
    fetchNoteById:
        [
            body('noteId').isString().bail().notEmpty()
        ],
    fetchUserNotifications:
        [
            body('limit').isString().bail().notEmpty(),
            body('offset').isString().bail().notEmpty()
        ],
    deleteGroupNote:
        [
            body('noteId').isString().bail().notEmpty(),
        ],
    deleteCategory:
        [
            body('groupId').isString().bail().notEmpty(),
            body('categoryId').isString().bail().notEmpty(),
            body('transferCategoryId').optional().isString().bail().notEmpty()
        ],
    deleteGroup:
        [
            GROUP_ID_DEFAULT_VALIDATION,
            body('switchDevicesGroupId').optional().isString().bail().notEmpty(),
            body('switchDevicesCategoryId').optional().isString().bail().notEmpty(),
            body('transferAllCategories').optional().isBoolean().bail().notEmpty(),
            body('keepAllUsers').optional().isBoolean().bail().notEmpty(),
            body('keepAllDevices').optional().isBoolean().bail().notEmpty(),
            body('keepAllScenes').optional().isBoolean().bail().notEmpty(),
            body('keepAllAutomations').optional().isBoolean().bail().notEmpty(),

        ],
    deleteGroupV3:
        [
            GROUP_ID_DEFAULT_VALIDATION,
            body('switchDevicesGroupId').optional().isString().bail().notEmpty(),
            body('switchDevicesCategoryId').optional().isString().bail().notEmpty(),
            body('transferAllCategories').optional().isBoolean().bail().notEmpty(),
            body('groupUsers').optional().isArray().bail().notEmpty(),
            body('groupUsers.*').isString(),
            body('groupDevices').optional().isArray().bail().notEmpty(),
            body('groupDevices.*').isString(),
            body('groupScenes').optional().isArray().bail().notEmpty(),
            body('groupScenes.*').isString(),
            body('groupAutomations').optional().isArray().bail().notEmpty(),
            body('groupAutomations.*').isString()
        ],
    deleteScene:
        [
            GROUP_ID_DEFAULT_VALIDATION,
            body('sceneId').isString().bail().notEmpty()
        ],
    deviceFilterationByMacAddress:
        [

            body('bleDevices').isArray(),
            body('bleDevices.*').isString(),
            body('wifiDevices').isArray(),
            body('wifiDevices.*').isString()

        ],
    fetchAutomationData:
        [
            body('automationId').optional().isString().bail().notEmpty()
        ],
    fetchDeviceById:
        [
            DEVICE_ID_DEFAULT_VALIDATION
        ],
    fetchGroupAutomations:
        [
            body('groupId').isString().bail().notEmpty()
        ],
    fetchGroupCategories:
        [
            GROUP_ID_DEFAULT_VALIDATION
        ],
    fetchGroupDevices:
        [
            GROUP_ID_DEFAULT_VALIDATION
        ],
    fetchGroupScenes:
        [
            GROUP_ID_DEFAULT_VALIDATION
        ],
    fetchGroupUsers:
        [
            GROUP_ID_DEFAULT_VALIDATION
        ],
    fetchPowerGraphForCategory:
        [
            GROUP_ID_DEFAULT_VALIDATION,
            body('categoryId').isString().bail().notEmpty(),
            body('dataTimeType').isString().bail().isIn(['daily', 'weekly', 'monthly']).bail().notEmpty(),
            body('startDate').isString().bail().notEmpty(),
            body('endDate').isString().bail().notEmpty()

        ],
    fetchPowerGraphForGroup:
        [
            GROUP_ID_DEFAULT_VALIDATION,
            body('dataTimeType').isString().bail().isIn(['daily', 'weekly', 'monthly']).bail().notEmpty(),
            body('startDate').isString().bail().notEmpty(),
            body('endDate').isString().bail().notEmpty()
        ],
    fetchSceneData:
        [
            body('sceneId').isString().bail().notEmpty()
        ],
    fetchScenesByDevices:
        [
            GROUP_ID_DEFAULT_VALIDATION,
            body('deviceIds').isArray()
        ],
    fetchAutomationByDevicesAndScenes: 
        [
            GROUP_ID_DEFAULT_VALIDATION,
            body('sceneIds').isArray(),
            body('deviceIds').isArray()
        ],
    transferDeviceToCategory:  
        [
            body('deviceId').isString().bail().notEmpty(),
            body('originalCategoryId').isString().bail().notEmpty(),
            body('newCategoryId').isString().bail().notEmpty()
        ],
    generateGroupInvitationCode:
        [
            body('groupId').isString().bail().notEmpty()
        ],
    manageFavouriteDevice:
        [
            body('deviceId').isString().bail().notEmpty(),
            body('favourite').isBoolean().bail().notEmpty()
        ],
    removeUserFromGroup:
        [
            body('groupId').isString().bail().notEmpty(),
            body('groupUserRelationId').isString().bail().notEmpty(),
        ],
    resolveUserNotification:
        [

            body('notificationId').isString().bail().notEmpty(),
            body('action').isString().notEmpty().bail().isIn(['1', '2', '3'])
        ],
    runScene:
        [
            body('sceneId').isString().bail().notEmpty()
        ],
    transferGroupRequest:
        [
            GROUP_ID_DEFAULT_VALIDATION,
            body('email').isEmail().bail().notEmpty(),
            body('keepUsers').isBoolean().toBoolean().notEmpty(),
            body('keepScenesAndAutomations').isBoolean().toBoolean().notEmpty()
        ],
    updateCategories:
        [
            body('groupId').isString().bail().notEmpty(),
            body('categoriesData').isArray().bail().notEmpty(),
            body('categoriesData.*.categoryId').isString().bail().notEmpty(),
            body('categoriesData.*.categoryName').isString().bail().notEmpty()
        ],
    updateCategory:
        [
            GROUP_ID_DEFAULT_VALIDATION,
            body('categoryId').isString().bail().notEmpty(),
            body('categoryName').isString().bail().notEmpty()
        ],
    updateConditionBasedAutomation:
        [
            GROUP_ID_DEFAULT_VALIDATION,
            body('automationId').isString().bail().notEmpty(),
            AUTOMATION_NAME_DEFAULT_VALDATION,
            body('triggerDeviceId').isString().bail().notEmpty(),
            body('triggerDeviceDataType').isString().bail().notEmpty(),
            body('deviceId').optional().isString().bail().notEmpty(),
            body('actions').isArray().bail().optional().notEmpty(),
            body('actions.*.actionType').optional().isString().bail().notEmpty(),
            body('actions.*.actionValue').optional().isString().bail().notEmpty(),
            body('sceneId').optional().isString().bail().notEmpty(),
            body('triggerDeviceValue').isString().bail().notEmpty(),
            body('triggerDeviceCondition').isString()
        ],
    updateGroupDetails:
        [
            body('groupId').isString().bail().notEmpty(),
            body('groupName').optional().isString().bail().notEmpty(),
            body('groupLatitude').optional().isString().bail().toFloat().isFloat().bail().notEmpty(),
            body('groupLongitude').optional().isString().bail().toFloat().isFloat().notEmpty(),
            body('groupType').optional().isString().bail().isIn(['container', 'property']).bail().notEmpty()
        ],
    updateScene:
        [
            GROUP_ID_DEFAULT_VALIDATION,
            body('sceneId').isString().bail().notEmpty(),
            body('sceneName').isString().bail().notEmpty(),
            body('sceneDevices').isArray().bail().notEmpty(),
            body('sceneDevices.*.deviceId').isString().bail().notEmpty(),
            body('sceneDevices.*.actionType').isString().bail().notEmpty(),
            body('sceneDevices.*.actionValue').isString().bail().notEmpty()
        ],
    updateTimeBasedAutomation:
        [
            GROUP_ID_DEFAULT_VALIDATION,
            body('automationId').isString().bail().notEmpty(),
            AUTOMATION_NAME_DEFAULT_VALDATION,
            body('triggerTime').isString().bail().trim().notEmpty(),
            body('triggerDate').optional().isString().bail().notEmpty(),
            // body('triggerTime').custom((value,{req})=>validationMethods.customTriggerTimeValidation(value,{req})),
            // body('triggerDate').custom((value,{req})=>validationMethods.customTriggerDateValidation(value, {req})),
            body('deviceId').optional().isString().bail().notEmpty(),
            body('actions').isArray().bail().optional().notEmpty(),
            body('actions.*.actionType').optional().isString().bail().notEmpty(),
            body('actions.*.actionValue').optional().isString().bail().notEmpty(),
            body('sceneId').optional().isString().bail().notEmpty(),
            body('triggerWeekDays').optional().isArray().bail().notEmpty()         
        ],
    updateUserNotificationSettings:
        [
            body('notificationType').isIn(['Information', 'Warning', 'Error']).bail().notEmpty(),
            body('value').isIn(['1', '0']).bail().notEmpty()
        ],
    validateDeviceOnboarding:
        [
            body('bleMacId').optional().isString().bail().notEmpty(),
            body('wifiMacId').optional().isString().bail().notEmpty()
        ],
    qrCodeOnboarding:
        [
            // body('qrCodeData').isObject({strict: true}).notEmpty(),
            body('qrCodeData').notEmpty(),
            body('qrCodeData.manufacturerId').isString().bail().notEmpty(),
            body('qrCodeData.serialNumber').isString().bail().notEmpty(),
        ],
    manualOnboarding:
        [
            body('deviceData').notEmpty(),
            body('deviceData.manufacturerId').isString().bail().notEmpty(),
            body('deviceData.serialNumber').isString().bail().notEmpty(),
        ],
    approveNewScene:
        [
            body('groupId').isString().bail().notEmpty(),
            body('sceneId').isString().bail().notEmpty(),
            body('approvalStatus').isString().bail().notEmpty(),
        ],
    validateConfigurationKeyFromDevice:
        [
            body('configurationKey').isString().bail().notEmpty(),
            body('deviceId').isString().bail().notEmpty(),
            body('deviceType').isString().bail().notEmpty(),
            body('manufacturerId').isString().bail().notEmpty(),
            body('serialNumber').isString().bail().notEmpty(),
            body('wifiStationMacId').isString().bail().notEmpty(),
            body('wifiAPMacId').isString().bail().notEmpty(),
            body('bleMacId').isString().bail().notEmpty(),
            body('featureIds.*').isString().bail().notEmpty()
        ],
    fetchGroupInvitationCodeAndUrl:
        [
            GROUP_ID_DEFAULT_VALIDATION
        ],
    deleteGroupInvitationCode:
        [
            GROUP_ID_DEFAULT_VALIDATION
        ],
    changeAutomationApprovalStatus:
        [
            GROUP_ID_DEFAULT_VALIDATION,
            body('automationId').isString().bail().notEmpty(),
            body('approvalStatus').isString().bail().notEmpty().bail().isIn(['approved', "unapproved"])
        ]
}

module.exports = async (req, res, next) => {
    const endpoint = req.originalUrl.replace(/^\/+|\/+$/g, '').split("/")[1]; //TODO: Optimize to be done only by RegEx
    // console.log(endpoint)
    const endpointValidationArray = ENDPOINTS[endpoint];
    // console.log(endpointValidationArray);
    if(!endpointValidationArray) return next();
    try {
        for (let eachField of endpointValidationArray)
        {
            await eachField.run(req);
        }
        const validationErrors = validationResult(req, true);
        // if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
        if(!validationErrors.isEmpty()) {
            console.log(validationErrors)
            const caughtError = new definedErrors.InvalidRequestContents();
            caughtError.setErrors(validationErrors.errors);
            caughtError.setType('info');
            return next(caughtError);
        }
        return next();
    } catch(error) {
        if(error instanceof ApplicationError) return next(error);
        const caughtError = new definedErrors.InternalServerError();
        caughtError.setAdditionalDetails(error);
        return next(caughtError);
    }
}