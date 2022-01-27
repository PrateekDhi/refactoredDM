const QueryExecutor = require('../NoSQLEntities/index');
const mongodb = require('mongodb');


class Scene extends QueryExecutor {
    constructor(_id, name, groupId, triggerTimes, devices, approvalStatus, creationTime, updationTime) {
        this._id = _id ? new mongodb.ObjectId(_id) : null;
        this.name = name;
        this.groupId = groupId;
        this.triggerTimes = triggerTimes;
        this.devices = devices;
        this.approvalStatus = approvalStatus;
        this.creationTime = creationTime;
        this.updationTime = updationTime;
    }

    insertSceneData(sceneData) {
        if (this._id) {
            return this.updateSingelDataSet([{ _id: this._id }, { $set: this }]);
        } else {
            if (sceneData == null) {
                return this.save(this);
            } else {
                return this.save(sceneData);
            }
        }
    }

    static deleteSceneData(ids) {
        return this.deleteById(ids);
    }

    static getSceneDataByDeviceIdsAggregation(deviceId) {
        const pipeline = [
            {
                $project: {
                    "_id": 0,
                    "sceneId": "$_id",
                    "devices": 1
                }
            },
            {
                $unwind: "$devices"
            },
            {
                $match: { "devices.deviceId": deviceId }   //Also add device type here to ensure only devices that can have power value are present
            },
            {
                $project: {
                    "sceneId": 1
                }
            }
        ];
        return this.getAggregationData(pipeline);
    }

    static getScenesAutomationViaAggregation(sceneIds) {
        const pipeline = [
            {
                $project: {
                    "_id": 0,
                    "automationId": "$_id",
                    "sceneId": "$event.sceneId"
                }
            },
            {
                $match: { "sceneId": { $in: sceneIds } }
            },
            {
                $project: {
                    "automationId": 1
                }
            }
        ];
        return this.getAggregationData(pipeline);
    }

    static getSceneCount(groupId, sceneId) {
        let countObj = { "_id": new mongodb.ObjectId(sceneId), "groupId": new mongodb.ObjectId(groupId) };
        return this.getCount(countObj);
    }

    static getGroupUserSceneCountViaAggregation(groupIds, userId) {
        const pipeline = [
            {
                $match: { "groupId": { $in: groupIds } }
            },
            {
                $lookup:
                {
                    from: 'scene_users',
                    localField: '_id',
                    foreignField: 'sceneId',
                    as: "sceneUsersData"
                }
            },
            {
                $unwind: {
                    "path": "$sceneUsersData",
                    "preserveNullAndEmptyArrays": false
                }
            },
            {
                $project: {
                    "_id": 1,
                    "groupId": 1,
                    "userId": "$sceneUsersData.userId"
                }
            },
            {
                $match: { "userId": new mongodb.ObjectId(userId) }
            },
            {
                $group: {
                    "_id": "$groupId",
                    "scenes": { $addToSet: "$_id" },
                }
            },
            {
                $project: {
                    "_id": 0,
                    "groupId": "$_id",
                    "groupSceneCount": { $cond: { if: { $isArray: "$scenes" }, then: { $size: "$scenes" }, else: "NA" } }
                }
            }

        ];
        return this.getAggregationData(pipeline);
    }

    static getGroupUserSceneListViaAggregation(groupId, userId){
        const pipeline = [
            {
                $match: { "groupId": new mongodb.ObjectId(groupId) }
            },
            {
                $lookup:
                {
                    from: 'scene_users',
                    localField: '_id',
                    foreignField: 'sceneId',
                    as: "sceneUsersData"
                }
            },
            {
                $unwind: "$sceneUsersData"
            },
            {
                $project: {
                    "_id": 0,
                    "sceneId": "$_id",
                    "sceneName": "$name",
                    "userId": "$sceneUsersData.userId"
                }
            },
            {
                $match: { "userId": new mongodb.ObjectId(userId) }
            },
            {
                $group: {
                    "_id": "$sceneId",
                    "sceneName": { $first: "$sceneName" },
                }
            },
            {
                $project: {
                    "sceneId": 1,
                    "sceneName": 1,
                }
            }
        ];
        return this.getAggregationData(pipeline);
    }

    static getGroupUserSceneListV2ViaAggregation(groupId, userId){
        const pipeline = [
            {
                $match: { "groupId": new mongodb.ObjectId(groupId) }
            },
            {
                $lookup:
                {
                    from: 'scene_users',
                    localField: '_id',
                    foreignField: 'sceneId',
                    as: "sceneUsersData"
                }
            },
            {
                $unwind: "$sceneUsersData"
            },
            {
                $addFields: {
                    "lastTriggerTime": { $slice: ["$triggerTimes", -1] },
                }
            },
            {
                $addFields: {
                    "lastTriggerTime": { $arrayElemAt: ["$triggerTimes", 0] }
                }
            },
            {
                $project: {
                    "_id": 0,
                    "sceneId": "$_id",
                    "sceneName": "$name",
                    "lastTriggerTime": 1,
                    "creationTime": 1,
                    "updationTime": 1,
                    "groupId": 1,
                    "approvalStatus": 1,
                    "userId": "$sceneUsersData.userId"
                }
            },
            {
                $match: { "userId": new mongodb.ObjectId(userId) }
            },
            {
                $group: {
                    "_id": "$sceneId",
                    "sceneName": { $first: "$sceneName" },
                    "lastTriggerTime": { $first: "$lastTriggerTime" },
                    "creationTime": { $first: "$creationTime" },
                    "updationTime": { $first: "$updationTime" },
                    "groupId": { $first: "$groupId" },
                    "approvalStatus": { $first: "$approvalStatus" },
                }
            },
            {
                $project: {
                    "_id": 0,
                    "sceneId": "$_id",
                    "sceneName": 1,
                    "lastTriggerTime": 1,
                    "creationTime": 1,
                    "updationTime": 1,
                    "groupId": 1,
                    "approvalStatus": 1
                }
            }
        ];
        return this.getAggregationData(pipeline);
    }

    static getSceneDataViaAggregation(sceneId){
        const pipeline = [
            {
                $match: { "_id": new mongodb.ObjectId(sceneId) }
            },
            {
                $addFields: {
                    "lastTriggerTime": { $slice: ["$triggerTimes", -1] },
                }
            },
            {
                $addFields: {
                    "lastTriggerTime": { $arrayElemAt: ["$triggerTimes", 0] }
                }
            },
            {
                $project: {
                    "_id": 0,
                    "sceneId": "$_id",
                    "sceneName": "$name",
                    "groupId": 1,
                    "lastTriggerTime": 1,
                    "devices": 1,
                    "creationTime": 1,
                    "updationTime": 1,
                    "approvalStatus": 1
                }
            }
        ];
        return this.getAggregationData(pipeline);
    }

    static getGroupsSceneDataViaAggregation(groupId){
        const pipeline = [
            {
                $match: { "groupId": new mongodb.ObjectId(groupId) }
            },
            {
                $addFields: {
                    "lastTriggerTime": { $slice: ["$triggerTimes", -1] },
                }
            },
            {
                $addFields: {
                    "lastTriggerTime": { $arrayElemAt: ["$triggerTimes", 0] }
                }
            },
            {
                $project: {
                    "_id": 0,
                    "sceneId": "$_id",
                    "sceneName": "$name",
                    "groupId": 1,
                    "lastTriggerTime": 1,
                    "devices": 1,
                    "creationTime": 1,
                    "updationTime": 1,
                    "approvalStatus": 1
                }
            }
        ];
        return this.getAggregationData(pipeline);
    }

    static getSceneDevicesViaAggregation(sceneId){
        const pipeline = [
            {
                $match: { "_id": new mongodb.ObjectId(sceneId) }
            },
            {
                $unwind: "$devices"
            },
            {
                $lookup:
                {
                    from: 'devices',
                    localField: 'devices.deviceId',
                    foreignField: '_id',
                    as: "deviceData"
                }
            },
            {
                $unwind: "$deviceData"
            },
            {
                $project: {
                    "_id": 0,
                    "sceneId": "$_id",
                    "groupId": 1,
                    "eventDeviceId": "$devices.deviceId",
                    "eventDeviceType": "$deviceData.type",
                    "eventDeviceSecondaryTopic": "$deviceData.secondaryTopic",
                    "eventDeviceActionType": "$devices.actionType",
                    "eventDeviceActionValue": "$devices.actionValue"
                }
            },
            {
                $group: {
                    "_id": "$eventDeviceId",
                    "sceneId": { $first: "$sceneId" },
                    "groupId": { $first: "$groupId" },
                    "eventDeviceType": { $first: "$eventDeviceType" },
                    "eventDeviceSecondaryTopic": { $first: "$eventDeviceSecondaryTopic" },
                    "eventDeviceActionData": { $push: { "actionType": "$eventDeviceActionType", "actionValue": "$eventDeviceActionValue" } }
                }
            },
            {
                $project: {
                    "_id": 0,
                    "sceneId": 1,
                    "groupId": 1,
                    "eventDeviceId": "$_id",
                    "eventDeviceType": 1,
                    "eventDeviceSecondaryTopic": 1,
                    "eventDeviceActionData": 1,
                }
            }
        ];
        return this.getAggregationData(pipeline);
    }

    static getSceneByDevicesViaAggregation(deviceIds, groupId){
        const pipeline = [
            {
                $match: { groupId: new mongodb.ObjectId(groupId) }
            },
            {
                $unwind: "$devices"
            },
            {
                $match: { "devices.deviceId": { $in: deviceIds } }
            },
            {
                $group: {
                    "_id": "$_id",
                    "name": { $first: "$name" },
                }
            },
            {
                $project:
                {
                    "sceneId": "$_id",
                    "_id": 0,
                    "name": 1
                }
            }
        ];
        return this.getAggregationData(pipeline);
    }

    static checkScenesGroupAndDevicesViaAggregation(sceneIds){
        const pipeline = [
            {
                $match: {
                    "_id": {
                        $in: sceneIds
                    }
                }
            },
            {
                $facet: {
                    totalCount: [
                        { $count: "values" }
                    ],
                    pipelineResult: [
                        {
                            $unwind: { path: "$devices" }
                        },
                        {
                            $group: {
                                "_id": "1",
                                groupId: {
                                    $push: "$groupId"
                                },
                                devices: {
                                    $push: "$devices.deviceId"
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                allGroups: {
                                    $setUnion: [
                                        "$groupId"
                                    ]
                                },
                                allDevices: {
                                    $setUnion: [
                                        "$devices"
                                    ]
                                }
                            }
                        }
                    ]
                }
            }, 
            {
                $unwind: "$totalCount"
            }, 
            {
                $unwind: "$pipelineResult"
            },
            {
                $project:{
                    _id: 0
                  }
            }
        ];
        return this.getAggregationData(pipeline);
    }

    static getGroupSceneIds(groupId){
        let findObj = { "groupId": new mongodb.ObjectId(groupId) };
        let projectObj = { "_id": 1 };
        return this.findAndProjectDataByOtherEntities(findObj, projectObj);
    }

    static getGivenSceneDataById(ids, fieldName) {
        const projectObj = {};
        projectObj[fieldName] = 1;
        return this.findAndProjectDataById(ids, projectObj);
    } 

    static getSceneApprovalStatus(sceneId){
        let findObj = { "_id": new mongodb.ObjectId(sceneId) };
        let projectObj = { "approvalStatus": 1 };
        return this.findAndProjectDataByOtherEntities(findObj, projectObj);
    }

    static updateSceneData(ids, groupId, switchToGroupId) {
        let updateSet;
        if (groupId != null) {
          updateSet = [{ "groupId": new mongodb.ObjectId(groupId) }, { "groupId": switchToGroupId }];
        } else {
          updateSet = [{ _id: { $in: ids } }, { "groupId": switchToGroupId }];
        }
        return this.updateMultipleDataSet(updateSet);
      }
}

module.exports = Scene;