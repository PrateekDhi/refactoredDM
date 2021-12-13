const cn = require('../utils/common');
const groupService = require('../services/group');
const categoryService = require('../services/category');

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

const userSpecificEvent = (socket, roomString, data) => {
    if(!data) return socket.leave(roomString + ":" + socket.handshake.userId);
    if(!typeof (elem) == "boolean") return; //TODO: Log error
    return socket.join(roomString + ":" + socket.handshake.userId);
}

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
        if(!result) throw new Error('Invalid group id');
        return socket.join(roomString + ":" + parsedData.groupId);
    })
    .catch(error => {
        //TODO: Log Error
        if(error.message == 'Invalid group id'){

        }
        //default return case
    })
}

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
        if(!results[0]) throw new Error('Invalid group id');
        if(!results[1]) throw new Error('Invalid category id');
        return socket.join(roomString + ":" + parsedData.groupId + ":" + parsedData.categoryId);
    })
    .catch(error => {
        //TODO: Log error;
        if(error.message == 'No data in data1 after parse'){

        }else if(error.message == 'Invalid group id'){

        }else if(error.message == 'Invalid category id'){

        }
        //default return case
    })
}

