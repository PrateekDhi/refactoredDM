const cn = require('../utils/common');

const groupService = require('../services/group');
const categoryService = require('../services/category');
const deviceService = require('../services/device');
const sceneService = require('../services/scene');
const automationService = require('../services/automation');
const groupUserService = require('../services/groupUser');

//Errors
const definedErrors = require('../errors');
const ApplicationError = definedErrors.ApplicationError;

module.exports = (req, res, next) => {
    //Create the array of functions to be called(all these functions return a promise)
    const promiseArray = [];
    if(req.body.groupId) promiseArray.push(groupService.checkGroupExistence(req.body.groupId));
    else promiseArray.push(Promise.resolve("No group id in request body"));
    if(req.body.categoryId) promiseArray.push(categoryService.getCategoryGroupId(req.body.categoryId));
    if(req.body.deviceId) promiseArray.push(deviceService.getDeviceGroupId(req.body.deviceId));
    if(req.body.groupUserRelationId) promiseArray.push(groupUserService.getUserRelationGroupId(req.body.groupUserRelationId));
    if(req.body.sceneId) promiseArray.push(sceneService.getSceneGroupId(req.body.sceneId));
    if(req.body.automationId) promiseArray.push(automationService.getSceneGroupId(req.body.automationId));
    if(req.body.deviceIds) promiseArray.push(deviceService.getMultipleDevicesGroupIdIfAllSame(req.body.deviceIds));
    if(req.body.sceneIds) promiseArray.push(groupUserService.getMultipleScenesGroupIdIfAllSame(req.body.sceneIds));

    Promise.all(promiseArray)
    .then(results => {
        //1) The first element of results will always be either the a boolean -> true denotes group exists, false denotes groupId is invalid or string -> "No group id in request body"
        //2) If the results array only has one element that means the request body either had only groupId or had none of the above ids 
        //3) If array size is greater than 1 and first element is not "No group id request body" then first array element should be boolean true and all the elements starting from index = 1 in the array must be same 
        //4) If array size is greater than 1 and first element is "No group id request body" All the other elements starting from index = 1 of the results array should contain the same groupId
        if(results.length === 1) {
            if(results[0] === "No group id in request body") return next();
            if(results[0] === false){
                //Group with the id given in request body does not exist
            }
            res.locals.groupId = req.body.groupId;
            return next();
        }
        if(results[0] === false){
            //Group with the id given in request body does not exist
        }
        results.shift();  //After this results will only contain elements starting from index = 1
        if(results[0] === true) results.push(req.body.groupId); //The groupId in the request body should be equal to all the group ids in the array
        if(!cn.allArrayElementsEqual(results)){
            //Entities in the request body do not belong to the same group
        }
        res.locals.groupId = results[0];
        return next();
    })
    .catch(error => {
        if(error instanceof ApplicationError) return next(error);
    })
}