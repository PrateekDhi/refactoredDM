const cn = require('../utils/common');
const Group = require('../models/SQL/Group');
const GroupUser = require('../models/SQL/GroupUser');
const Automation = require('../models/NoSQL/Automation');
const AutomationUser = require('../models/NoSQL/AutomationUser');
const AutomationActivationStatus = require('../utils/helpers/automationActivationStatus');

const definedErrors = require('../errors');
const ApplicationError = definedErrors.ApplicationError;

/**
 * 
 * @author Prateek Shukla
 * @description The function is used to get runnable time and scene based automations
 * @param none
 * @returns {Promise} - Promise object represents array of time and scene based automations
 * @throws Database server error, Internal server error
 * @todo none
 * 
**/

exports.getRunnableTimeAndSceneBasedAutomations = () => {
    const {ISTTime, currentHour, currentMinute, currentWeekDay, currentYear, currentMonth, currentDayOfMonth} = getCurrentTimeData();

    return Automation.findGroupAndEventDataFromSceneBasedByTriggerTimeValues(currentHour, currentMinute, ISTTime, currentYear, currentMonth, currentDayOfMonth, currentWeekDay);
}

/**
 * 
 * @author Prateek Shukla
 * @description The function is used to get runnable time and scene based automations
 * @param none
 * @returns {Promise} - Promise object represents array of time and scene based automations
 * @throws Database server error, Internal server error
 * @todo none
 * 
**/
exports.getRunnableTimeAndDeviceBasedAutomations = () => {
    const {ISTTime, currentHour, currentMinute, currentWeekDay, currentYear, currentMonth, currentDayOfMonth} = getCurrentTimeData();

    return Automation.findGroupAndEventDataFromDeviceBasedByTriggerTimeValues(currentHour, currentMinute, ISTTime, currentYear, currentMonth, currentDayOfMonth, currentWeekDay);
}

/**
 * 
 * @author Prateek Shukla
 * @description The function is used to insert time based automation to DB
 * @param {string} groupId - Id of the group to which the automation is being added to
 * @param {string} automationName - Name of the automation
 * @param {string} triggerType - Type of trigger - Time based or condition based
 * @param {Object} trigger - Object containing trigger values according to triggerType
 * @param {string} eventType - Type of event - Scene based or device based
 * @param {Object} event - Object containing event values according to eventType
 * @param {string} approvalStatus - Approval status of the automation to be created, approved or unapproved
 * @param {boolean} allUsersAccess - Boolean representing whether all the users of the group will have access to this automation or not
 * @param {string} creatingUserId - Id of the user who is creating this automation
 * @returns {Promise} - Promise object represents array of time and scene based automations
 * @throws Database server error, Internal server error
 * @todo User access handling for automation, add error for mongo error inside catch
 * 
**/
exports.createAutomation = (groupId, automationName, triggerType, trigger, eventType, event, approvalStatus, allUsersAccess, creatingUserId) => {
    return new Promise((resolve, reject) => {  
        generateAutomationId()
        .then(id => {
            const automation = new Automation(id, groupId, eventType, triggerType, automationName, AutomationActivationStatus.Activate, trigger, event, approvalStatus, Date.now(), Date.now());
            return automation.save();
        })
        .then((insertResult) => {
            // if(rows.affectedRows != 1) throw new Error("No rows affected while inserting time based automation");
            if(!insertResult.acknowledged || !insertResult.insertedId) throw new Error("No rows affected while inserting time based automation");
            return Promise.all([insertResult.insertedId, GroupUser.findByGroupId(groupId)]);
        })
        .then((automationId, groupUsersData) => {
             //Current Solution
             return Promise.all([automationId, AutomationUser.insertMultipleDataIntoAutomationUsers(groupUsersData.map(object => {
                if(object.userId == creatingUserId) return {userId:object.userId, automationId: automationId, creator: true}
                return {userId:object.userId, automationId: automationId, creator: false}
            }))]);


            //Proposed Solution
            // if(allUsersAccess){
            //     return Promise.all([automationId, AutomationUser.insertMultipleDataIntoAutomationUsers(groupUsersData.map(object => {
            //         if(object.userId == creatingUserId) return {userId:object.userId, automationId: automationId, creator: true}
            //         return {userId:object.userId, automationId: automationId, creator: false}
            //     }))]);
            // } else {
            //     return Promise.all([automationId, "no users added by default"]);
            // }
        })
        .then((automationId, insertManyResult) => {
            if(!insertManyResult.acknowledged || !insertResult.insertedId) throw new Error("No rows affected while inserting users to time based automation");
            return resolve(automationId);
        })
        .catch(error => {
            if(error instanceof ApplicationError) return reject(error);
            //TODO: Add mongo error check here
            const caughtError = new definedErrors.InternalServerError();
            caughtError.setAdditionalDetails(error);
            return reject(caughtError);
        });
    })
}


/**
 * 
 * @author Prateek Shukla
 * @description The function is used to get current time details
 * @param none
 * @returns {Object} - Object having data about current time - ISTTime, currentHour, currentMinute, currentWeekDay, currentYear, currentMonth, currentDayOfMonth
 * @throws none
 * @todo none
 * 
**/
const getCurrentTimeData = () => {
    const currentTime = new Date();
    const currentOffset = currentTime.getTimezoneOffset();
    const ISTOffset = 330;   // IST offset UTC +5:30 
    const ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset)*60000);
    const currentHour = ISTTime.getHours();
    const currentMinute = ISTTime.getMinutes();
    const currentWeekDay = ISTTime.getDay();
    const currentYear = ISTTime.getFullYear();
    const currentMonth = ISTTime.getMonth() + 1;  //Since .getMonth gives value from 0 to 11
    const currentDayOfMonth = ISTTime.getDate();

    return {ISTTime, currentHour, currentMinute, currentWeekDay, currentYear, currentMonth, currentDayOfMonth};
}