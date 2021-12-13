const cn = require('../utils/common');
const groupService = require('../services/group');

//Cannot use arrow function due to the context of 'this' wont be the socket instance in arrow function
//TODO: Can we condense down these event handlers to reduce code - user specific events, group specific events
// exports.userSpecificEvent = function(data){

// }

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
        if(!result) return; //TODO: Log Invalid group id
        return socket.join(roomString + ":" + parsedData.groupId);
    })
    .catch(err => {return})//TODO: Log Error
}

//TODO: Pending, waiting for correction in logic from NK
const groupAndCategorySpecificEvent = (socket, roomString, data1, data2) => {
    if (!typeof (elem2) == "boolean" || (!typeof (elem1) == "string" || !elem1)) return; //TODO: Log error
    if(!elem2) {
        return [...socket.rooms]
        .filter(room => {
            if (room.split(":")[0] == roomString) {
                return room.split(":")[2] != parsedData.categoryId;
            }
            return false;
        })
        .forEach(room => socket.leave(room));
    }
}

