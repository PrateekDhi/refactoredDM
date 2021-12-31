const { body, oneOf } = require('express-validator')

//Constant Validations (Used in multiple endpoints)
const GROUP_ID_DEFAULT_VALIDATION = body('groupId').isString().notEmpty()
const DEVICE_ID_DEFAULT_VALIDATION = body('deviceId').isString().notEmpty()
const AUTOMATION_NAME_DEFAULT_VALDATION = body('automationName').isString().notEmpty()
const ALL_USERS_ACCESS_DEFAULT_VALIDATION = body('allUsersAccess').isBoolean().notEmpty()
const GROUP_LATITUDE_DEFAULT_VALIDATION = oneOf([
    body('groupLatitude').isString().notEmpty(),
    body('groupLatitude').isFloat().notEmpty(),
])

const GROUP_LONGITUDE_DEFAULT_VALIDATION = oneOf([
    body('groupLongitude').isString().notEmpty(),
    body('groupLongitude').isFloat().notEmpty()
])

const ENDPOINTS = {
    addNewDevice:
        [

            GROUP_ID_DEFAULT_VALIDATION,
            body(['categoryId', 'configurationKey', 'deviceName']).isString().notEmpty(),
            // body('categoryId').isString().notEmpty(),
            // body('configurationKey').isString().notEmpty(),
            // body('deviceName').isString().notEmpty(),
        ],
    addUserToGroupRequest:
        [
            body('groupId').optional().isString().notEmpty(),
            body('email').optional().isEmail().notEmpty()
        ],
    transferDevice:
        [
            body(['deviceId', 'transferGroupId', 'transferCategoryId']).isString().notEmpty().trim()
            // body('transferGroupId').isString().trim().notEmpty(),
            // body('transferCategoryId').isString().trim().notEmpty()
        ],
    addUserToGroupViaInvitationCode:
        [
            body('code').isString().notEmpty()
        ],
    addUserToGroupViaInvitationCodeV2:
        [
            body('code').isString().notEmpty()
        ],
    changeAutomationActivationStatus:
        [
            body('automationId').isString().notEmpty(),
            body('activationStatus').isString().notEmpty()
        ],
    checkDeviceActivation:
        [
            body('configurationKey').optional().isString().notEmpty()
        ],
    controlDevice:
        [
            body('deviceId').isString().notEmpty(),
            body('actionType').isString().notEmpty(),
            body('actionValue').isString().notEmpty()
        ],
    createCategories:
        [
            GROUP_ID_DEFAULT_VALIDATION,
            body('categoryName.*').isString().notEmpty()
        ],
    createCategory:
        [
            GROUP_ID_DEFAULT_VALIDATION,
            body('categoryName').isString().notEmpty()
        ],
    createConditionBasedAutomation:
        [
            GROUP_ID_DEFAULT_VALIDATION,
            AUTOMATION_NAME_DEFAULT_VALDATION,
            body('triggerDeviceId').isString().notEmpty(),
            body('triggerDeviceDataType').isString().notEmpty(),
            body('triggerDeviceValue').isString().notEmpty(),
            body('deviceId').optional().isString().notEmpty(),
            body('actions').isArray().optional().notEmpty(),
            body('actions.*.actionType').optional().isString().notEmpty(),
            body('actions.*.actionValue').optional().isString().notEmpty(),
            body('sceneId').optional().isString().notEmpty(),
            body('triggerDeviceCondition').isString().notEmpty(),
            body('allowUsersAccess').optional().isString().notEmpty()
        ],
    createGroup:
        [
            body('groupName').isString().notEmpty(),
            body('groupLatitude').optional().isString().notEmpty(),
            body('groupLongitude').optional().isString().notEmpty()
        ],
    createGroupV2:
        [
            body('groupName').isString().notEmpty(),
            // groupLatitude,
            body('groupLatitude').isString().toFloat().isFloat().notEmpty(),
            body('groupLongitude').isString().toFloat().isFloat().notEmpty(),
            body('groupType').isString().isIn(['container', 'property']).notEmpty(),
            body('categoryNames').isArray().notEmpty(),
            body('categoryNames.*').isString()
        ],
    createScene:
        [
            body('groupId').isString().notEmpty(),
            body('sceneName').isString().notEmpty(),
            body('sceneDevices').isArray().notEmpty(),
            body('sceneDevices.*.deviceId').isString().notEmpty(),
            body('sceneDevices.*.actionType').isString().notEmpty(),
            body('sceneDevices.*.actionValue').isString().notEmpty(),
            ALL_USERS_ACCESS_DEFAULT_VALIDATION
        ],
    approveNewScene:
        [
            body('groupId').isString().notEmpty(),
            body('sceneId').isString().notEmpty(),
            body('approvalStatus').isString().notEmpty(),
        ],
    createTimeBasedAutomation:
        [
            GROUP_ID_DEFAULT_VALIDATION,
            AUTOMATION_NAME_DEFAULT_VALDATION,
            body('triggerTime').isString().trim().notEmpty(),
            // body('triggerTime').custom((value,{req})=>validationMethods.customTriggerTimeValidation(value,{req})),
            body('triggerWeekDays').optional().isArray().notEmpty(),
            ALL_USERS_ACCESS_DEFAULT_VALIDATION,
            body('deviceId').optional().notEmpty().isString(),
            body('actions').isArray().optional().notEmpty(),
            body('actions.*.actionType').optional().isString().notEmpty(),
            body('actions.*.actionValue').optional().isString().notEmpty(),
            body('sceneId').optional().isString().notEmpty(),
            body('triggerDate').optional().isString().notEmpty()
            // body('triggerDate').custom((value,{req})=>validationMethods.customTriggerDateValidation(value, {req}))
        ],
    deleteAutomation:
        [
            body('automationId').isString().notEmpty(),
            body('groupId').isString().notEmpty()
        ],
    createGroupNote:
        [
            body('groupId').isString().notEmpty(),
            body('body').isString().isLength({ min: 2, max: 280 }).notEmpty()
        ],
    updateGroupNote:
        [
            body('noteId').isString().notEmpty(),
            body('body').isString().isLength({ min: 2, max: 280 }).notEmpty()
        ],
    fetchGroupNotes:
        [
            body('limit').isString().notEmpty(),
            body('offset').isString().notEmpty(),
            body('groupId').isString().notEmpty()
        ],
    fetchNoteById:
        [
            body('noteId').isString().notEmpty()
        ],
    fetchUserNotifications:
        [
            body('limit').isString().notEmpty(),
            body('offset').isString().notEmpty()
        ],
    deleteGroupNote:
        [
            body('noteId').isString().notEmpty(),
        ],
    deleteCategory:
        [
            body('groupId').isString().notEmpty(),
            body('categoryId').isString().notEmpty(),
            body('transferCategoryId').optional().isString().notEmpty()
        ],
    deleteGroup:
        [
            GROUP_ID_DEFAULT_VALIDATION,
            body('switchDevicesGroupId').optional().isString().notEmpty(),
            body('switchDevicesCategoryId').optional().isString().notEmpty(),
            body('transferAllCategories').optional().isBoolean().notEmpty(),
            body('keepAllUsers').optional().isBoolean().notEmpty(),
            body('keepAllDevices').optional().isBoolean().notEmpty(),
            body('keepAllScenes').optional().isBoolean().notEmpty(),
            body('keepAllAutomations').optional().isBoolean().notEmpty(),

        ],
    deleteGroupV3:
        [
            GROUP_ID_DEFAULT_VALIDATION,
            body('switchDevicesGroupId').optional().isString().notEmpty(),
            body('switchDevicesCategoryId').optional().isString().notEmpty(),
            body('transferAllCategories').optional().isBoolean().notEmpty(),
            body('groupUsers').optional().isArray().notEmpty(),
            body('groupUsers.*').isString(),
            body('groupDevices').optional().isArray().notEmpty(),
            body('groupDevices.*').isString(),
            body('groupScenes').optional().isArray().notEmpty(),
            body('groupScenes.*').isString(),
            body('groupAutomations').optional().isArray().notEmpty(),
            body('groupAutomations.*').isString()
        ],
    deleteScene:
        [
            GROUP_ID_DEFAULT_VALIDATION,
            body('sceneId').isString().notEmpty()
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
            body('automationId').optional().isString().notEmpty()
        ],
    fetchDeviceById:
        [
            DEVICE_ID_DEFAULT_VALIDATION
        ],
    fetchGroupAutomations:
        [
            body('groupId').isString().notEmpty()
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
            body('categoryId').isString().notEmpty(),
            body('dataTimeType').isString().isIn(['daily', 'weekly', 'monthly']).notEmpty(),
            body('startDate').isString().notEmpty(),
            body('endDate').isString().notEmpty()

        ],
    fetchPowerGraphForGroup:
        [
            GROUP_ID_DEFAULT_VALIDATION,
            body('dataTimeType').isString().isIn(['daily', 'weekly', 'monthly']).notEmpty(),
            body('startDate').isString().notEmpty(),
            body('endDate').isString().notEmpty()
        ],
    fetchSceneData:
        [
            body('sceneId').isString().notEmpty()
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
            body('deviceId').isString().notEmpty(),
            body('originalCategoryId').isString().notEmpty(),
            body('newCategoryId').isString().notEmpty()
        ],
    generateGroupInvitationCode:
        [
            body('groupId').isString().notEmpty()
        ],
    manageFavouriteDevice:
        [
            body('deviceId').isString().notEmpty(),
            body('favourite').isBoolean().notEmpty()
        ],
    removeUserFromGroup:
        [
            body('groupId').isString().notEmpty(),
            body('groupUserRelationId').isString().notEmpty(),
        ],
    resolveUserNotification:
        [

            body('notificationId').isString().notEmpty(),
            body('action').isString().notEmpty().isIn(['1', '2', '3'])
        ],
    runScene:
        [
            body('sceneId').isString().notEmpty()
        ],
    transferGroupRequest:
        [
            GROUP_ID_DEFAULT_VALIDATION,
            body('email').isEmail().notEmpty(),
            body('keepUsers').isBoolean().toBoolean().notEmpty(),
            body('keepScenesAndAutomations').isBoolean().toBoolean().notEmpty()
        ],
    updateCategories:
        [
            body('groupId').isString().notEmpty(),
            body('categoriesData').isArray().notEmpty(),
            body('categoriesData.*.categoryId').isString().notEmpty(),
            body('categoriesData.*.categoryName').isString().notEmpty()
        ],
    updateCategory:
        [
            GROUP_ID_DEFAULT_VALIDATION,
            body('categoryId').isString().notEmpty(),
            body('categoryName').isString().notEmpty()
        ],
    updateConditionBasedAutomation:
        [
            GROUP_ID_DEFAULT_VALIDATION,
            body('automationId').isString().notEmpty(),
            AUTOMATION_NAME_DEFAULT_VALDATION,
            body('triggerDeviceId').isString().notEmpty(),
            body('triggerDeviceDataType').isString().notEmpty(),
            body('deviceId').optional().isString().notEmpty(),
            body('actions').isArray().optional().notEmpty(),
            body('actions.*.actionType').optional().isString().notEmpty(),
            body('actions.*.actionValue').optional().isString().notEmpty(),
            body('sceneId').optional().isString().notEmpty(),
            body('triggerDeviceValue').isString().notEmpty(),
            body('triggerDeviceCondition').isString()
        ],
    updateGroupDetails:
        [
            body('groupId').isString().notEmpty(),
            body('groupName').optional().isString().notEmpty(),
            body('groupLatitude').optional().isString().toFloat().isFloat().notEmpty(),
            body('groupLongitude').optional().isString().toFloat().isFloat().notEmpty(),
            body('groupType').optional().isString().isIn(['container', 'property']).notEmpty()
        ],
    updateScene:
        [
            GROUP_ID_DEFAULT_VALIDATION,
            body('sceneId').isString().notEmpty(),
            body('sceneName').isString().notEmpty(),
            body('sceneDevices').isArray().notEmpty(),
            body('sceneDevices.*.deviceId').isString().notEmpty(),
            body('sceneDevices.*.actionType').isString().notEmpty(),
            body('sceneDevices.*.actionValue').isString().notEmpty()
        ],
    updateTimeBasedAutomation:
        [
            GROUP_ID_DEFAULT_VALIDATION,
            body('automationId').isString().notEmpty(),
            AUTOMATION_NAME_DEFAULT_VALDATION,
            body('triggerTime').isString().trim().notEmpty(),
            body('triggerDate').optional().isString().notEmpty(),
            // body('triggerTime').custom((value,{req})=>validationMethods.customTriggerTimeValidation(value,{req})),
            // body('triggerDate').custom((value,{req})=>validationMethods.customTriggerDateValidation(value, {req})),
            body('deviceId').optional().isString().notEmpty(),
            body('actions').isArray().optional().notEmpty(),
            body('actions.*.actionType').optional().isString().notEmpty(),
            body('actions.*.actionValue').optional().isString().notEmpty(),
            body('sceneId').optional().isString().notEmpty(),
            body('triggerWeekDays').optional().isArray().notEmpty()         
        ],
    updateUserNotificationSettings:
        [
            body('notificationType').isIn(['Information', 'Warning', 'Error']).notEmpty(),
            body('value').isIn(['1', '0']).notEmpty()
        ],
    validateDeviceOnboarding:
        [
            body('bleMacId').optional().isString().notEmpty(),
            body('wifiMacId').optional().isString().notEmpty()
        ],
    qrCodeOnboarding:
        [
            // body('qrCodeData').isObject({strict: true}).notEmpty(),
            body('qrCodeData').notEmpty(),
            body('qrCodeData.manufacturerId').isString().notEmpty(),
            body('qrCodeData.serialNumber').isString().notEmpty(),
        ],
    manualOnboarding:
        [
            body('deviceData').notEmpty(),
            body('deviceData.manufacturerId').isString().notEmpty(),
            body('deviceData.serialNumber').isString().notEmpty(),
        ],
    approveNewScene:
        [
            body('groupId').isString().notEmpty(),
            body('sceneId').isString().notEmpty(),
            body('approvalStatus').isString().notEmpty(),
        ],
    validateConfigurationKeyFromDevice:
        [
            body('configurationKey').isString().notEmpty(),
            body('deviceId').isString().notEmpty(),
            body('deviceType').isString().notEmpty(),
            body('manufacturerId').isString().notEmpty(),
            body('serialNumber').isString().notEmpty(),
            body('wifiStationMacId').isString().notEmpty(),
            body('wifiAPMacId').isString().notEmpty(),
            body('bleMacId').isString().notEmpty(),
            body('featureIds.*').isString().notEmpty()
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
            body('automationId').isString().notEmpty(),
            body('approvalStatus').isString().notEmpty().isIn(['approved', "unapproved"])
        ]
}

module.exports = (endpoint) => {
    const requiredEndpoint = ENDPOINTS[endpoint];
    if(!requiredEndpoint) return [];
    return requiredEndpoint;
}