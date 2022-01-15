/**
 *
 * file - eventsManager.js - Socket events managers
 *
 * @author     Nikita Kriplani
 * @version    0.1.0
 * @created    10/11/2021
 * @copyright  Dhi Technologies
 * @license    For use by Dhi Technologies applications
 *
 * @description - File for defining events managers of socket io
 *
 *
 * Unknown    - NK - Created
 * 13/12/2021 - PS - Updated
 *
**/

const cn = require('../utils/common');

//Services
const groupService = require('../services/group');
const categoryService = require('../services/category');

//Errors
const definedErrors = require('../errors');
const errorHandler = require('../utils/handlers/error');

//Cannot use arrow function due to the context of 'this' wont be the socket instance in arrow function
//TODO: Can we condense down these event handlers to reduce code - user specific events, group specific events
// exports.userSpecificEvent = function(data){

// }
//TODO: If we could some how get he name of the event which was triggered inside the event handler with 'this' we can replace all the exported function with simply specific event functions
//this.eventNames() gives an array of all the events which cannot be used for this
exports.groupListEvent = function(data){
    return userSpecificEvent(this, "groupList", data);
}

exports.favouriteDevicesListEvent = function(data){
    return userSpecificEvent(this, "favouriteDevicesList", data);
}

exports.groupScenesEvent = function(data){
    return groupSpecificEvent(this, "groupScenes", data);
}

exports.groupAutomationsEvent = function(data){
    return groupSpecificEvent(this, "groupAutomations", data);
}

exports.groupDevicesEvent = function(data){
    return groupSpecificEvent(this, "groupDevices", data);
}

exports.groupMembersEvent = function(data){
    return groupSpecificEvent(this, "groupMembers", data);
}

exports.groupCategoriesEvent = function(data){
    return groupSpecificEvent(this, "groupCategories", data);
}

exports.categorisedDevicesEvent = function(data1, data2){
    return groupAndCategorySpecificEvent(this, "categorisedDevices", data1, data2);
}

/**@description - Function which defined the handling of user specific events. In user specific events, the socket connections for only one single user are involved**/
const userSpecificEvent = async (socket, roomString, data) => {
    if(!data) return socket.leave(roomString + ":" + socket.handshake.userId);
    if(!typeof (elem) == "boolean") {
        let caughtError = new definedErrors.InvalidSocketData();
        caughtError.setMessage('Data sent for user specific event was not boolean');
        return await errorHandler.handleError(caughtError);
    }
    return socket.join(roomString + ":" + socket.handshake.userId);
}

/**
 * 
 * @description - Function which defined the handling of group specific events. In group specific events, 
 * the socket connections for all the users of a single group are involved
 * 
**/
const groupSpecificEvent = (socket, roomString, data) => {
    if(!data || !typeof (data) == "string") return; //TODO: Log error
    cn
    .parseAsync(data)
    .then(parsedData => {
        if(!parsedData) {
            return [...socket.rooms]
            .filter(room => room.split(":")[0] == roomString)
            .forEach(room => socket.leave(room));
        }
        return groupService.checkGroupExistence(parsedData.groupId)        
    })
    .then(result => {
        if(!result) throw new Error('Incorrect group id');
        return socket.join(roomString + ":" + parsedData.groupId);
    })
    .catch(async error => {
        let caughtError
        if(error.message == 'Incorrect group id'){
            caughtError = new definedErrors.IncorrectGroupId();
            return await errorHandler.handleError(caughtError);
        }
        caughtError = new definedErrors.InternalServerError();
        caughtError.setAdditionalDetails(error);
        return await errorHandler.handleError(caughtError);
        //default return case
    })
}

/** 
 * 
 * @description - Function which defined the handling of group AND category specific events. In these events, 
 * the socket connections for all the users of a single group are involved but the name of the rooms are also based on the category along with group
 * 
**/
const groupAndCategorySpecificEvent = (socket, roomString, data1, data2) => {
    if (!typeof (data2) == "boolean" || (!typeof (data1) == "string" || !data1)) return; //TODO: Log error
    cn.parseAsync(data1)
    .then(parsedData => {
        if(!data2) {
            return [...socket.rooms]
            .filter(room => {
                if (room.split(":")[0] == roomString) {
                    return room.split(":")[2] != parsedData.categoryId;
                }
                return false;
            })
            .forEach(room => socket.leave(room));
        }
        if(!parsedData) throw new Error('No data in data1 after parse');
        return Promise.all([
            groupService.checkGroupExistence(parsedData.groupId),
            categoryService.checkCategoryExistence(parsedData.groupId, parsedData.categoryId)
        ])
    })
    .then(results => {
        if(!results[0]) throw new Error('Incorrect group id');
        if(!results[1]) throw new Error('Incorrect category id');
        return socket.join(roomString + ":" + parsedData.groupId + ":" + parsedData.categoryId);
    })
    .catch(async error => {
        let caughtError;
        //TODO: Log error;
        if(error.message == 'No data in data1 after parse'){
            caughtError = new definedErrors.InvalidSocketData();
            caughtError.setMessage('No data in data1 after parse during group and category specific event');
            return await errorHandler.handleError(caughtError);
        }else if(error.message == 'Incorrect group id'){
            caughtError = new definedErrors.IncorrectGroupId();
            return await errorHandler.handleError(caughtError);
        }else if(error.message == 'Incorrect category id'){
            caughtError = new definedErrors.IncorrectCategoryId();
            return await errorHandler.handleError(caughtError);
        }
        caughtError = new definedErrors.InternalServerError();
        caughtError.setAdditionalDetails(error);
        return await errorHandler.handleError(caughtError);
        //default return case
    })
}

