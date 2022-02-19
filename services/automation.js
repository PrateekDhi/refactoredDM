const cn = require('../utils/common');
const Automation = require('../models/NoSQL/Automation');
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