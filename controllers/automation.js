/**
 *
 * file - automation.js - Automation entity controller
 *
 * @version    0.1.0
 * @created    23/10/2021
 * @copyright  Dhi Technologies
 * @license    For use by dhi Technologies applications
 *
 * Description : This file contains controller functionalities for all automation related endpoints
 *
 *
 * 23/10/2021 - PS - Refactored
 *
 *  
**/
const cn = require('../utils/common');
const config = require('../config');

//Models
// const Automation = require('../models/NoSQL/Automation');

//Services
// const automationService = require('../services/automation');

//Response model
const Response = require('../utils/response');

//Errors
const definedErrors = require('../errors');
const Roles = require('../utils/helpers/roles');
const ApplicationError = definedErrors.ApplicationError;

exports.changeAutomationActivationStatus = (automationId, activationStatus, userId) => {
    /**
     * @Validations
     * 1) Does the automation with the given id exists
     * 2) Is the activation status within the defined enum
     * 
    **/ 
    return new Promise((resolve,reject) => {
        
    })
}

exports.createTimeBasedAutomation = (groupId, automationName, triggerTime, triggerWeekDays, allUsersAccess, deviceId, actions, sceneId, triggerDate, userId) => {
    /**
     * @Validations
     * 1) Does the automation with the given id exists
     * 2) 
     * 
    **/ 
    return new Promise((resolve,reject) => {
        if(!res.locals.userRole) {
            const caughtError = definedErrors.InternalServerError();
            caughtError.setAdditionalDetails("User role not present in res.locals, res.locals = " + res.locals);
            reject(caughtError);
        }
        if(res.locals.userRole == Roles.Owner){
            automationService.createNewTimeBasedAutomation(groupId, automationName, triggerTime, triggerWeekDays, allUsersAccess, deviceId, actions, sceneId, triggerDate, userId)
            .then(automationId => {
                
            })
        }else if(res.locals.userRole == Roles.Member) {

        }else {
            const caughtError = definedErrors.Forbidden();
            caughtError.setAdditionalDetails("Incorrect userRole in res.locals during createTimeBasedAutomation, res.locals.userRole = " + res.locals.userRole);
            reject(caughtError);
        }
    })
}

exports.updateTimeBasedAutomation = (groupId, automationId, automationName, triggerTime, triggerWeekDays, deviceId, actions, sceneId, triggerDate, userId) => {
    /**
     * @Validations
     * 1) Does the automation with the given id exists
     * 2) Is the activation status within the defined enum
     * 
    **/ 
    return new Promise((resolve,reject) => {
        
    })
}

exports.createConditionBasedAutomation = (groupId, automationName, triggerDeviceId, triggerDeviceDataType, triggerDeviceValue, triggerDeviceCondition, allUsersAccess, deviceId, actions, sceneId, notify, userId) => {
    /**
     * @Validations
     * 1) Does the automation with the given id exists
     * 2) Is the activation status within the defined enum
     * 
    **/ 
    return new Promise((resolve,reject) => {
        
    })
}

exports.updateConditionBasedAutomation = (groupId, automationId, automationName, triggerDeviceId, triggerDeviceDataType, triggerDeviceValue, triggerDeviceCondition, allUsersAccess, deviceId, actions, sceneId, userId) => {
    /**
     * @Validations
     * 1) Does the automation with the given id exists
     * 2) Is the activation status within the defined enum
     * 
    **/ 
    return new Promise((resolve,reject) => {
        
    })
}

exports.deleteAutomation = (groupId, automationId, userId) => {
    /**
     * @Validations
     * 1) Does the automation with the given id exists
     * 2) Is the activation status within the defined enum
     * 
    **/ 
    return new Promise((resolve,reject) => {
        
    })
}

exports.fetchAutomationData = (automationId, userId) => {
    /**
     * @Validations
     * 1) Does the automation with the given id exists
     * 2) Is the activation status within the defined enum
     * 
    **/ 
    return new Promise((resolve,reject) => {
        
    })
}

exports.changeAutomationApprovalStatus = (groupId, automationId, approvalStatus, userId) => {
    /**
     * @Validations
     * 1) Does the automation with the given id exists
     * 2) Is the activation status within the defined enum
     * 
    **/ 
    return new Promise((resolve,reject) => {
        
    })
}

exports.fetchAutomationByDevicesAndScenes = (groupId, deviceIds, sceneIds, userId) => {
    /**
     * @Validations
     * 1) Does the automation with the given id exists
     * 2) Is the activation status within the defined enum
     * 
    **/ 
    return new Promise((resolve,reject) => {
        
    })
}

