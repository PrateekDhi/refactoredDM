/**
 *
 * file - index.js - The file that is used to fetch and manipulate notification database
 *
 * @author     Nikita Kriplani
 * @version    0.1.0
 * @created    17/01/2022
 * @copyright  Dhi Technologies
 * @license    For use by Dhi Technologies applications
 *
 * @description - All databse queries will be performed here
 * @todo - delete, insert and update function. 
 * 
**/

const mongodb = require('mongodb');
const getDb = require('../../../utils/databases/mongo').getDb;
const DatabaseServerError = require('../../../errors/database_server_error');
const QueryExecutor = require('../NoSQLEntities');


module.exports = class Notifications extends QueryExecutor {
    constructor(_id, title, userId, type, notificationType, status, data, isActionable, creationTime, imageUrl, message) {
        super("notifications");
        this._id = _id ? new mongodb.ObjectId(_id) : null;
        this.title = title;
        this.userId = userId;
        this.type = type;
        this.notificationType = notificationType;
        this.status = status;
        this.data = data;
        this.isActionable = isActionable;
        this.creationTime = creationTime;
        this.imageUrl = imageUrl;
        this.message = message;
    }

    insertNewData() {
        if (this._id) {
            return this.updateSingelDataSet([{ _id: this._id }, { $set: this }]);
        } else {
            return this.save(this);
        }
    }

    static fetchAggregation(_id) {
        const pipeline = [
            {
                $match: { "_id": new mongodb.ObjectId(_id) }
            },
            {
                $addFields: {
                    "status": { $slice: ["$status", -1] },
                }
            },
            {
                $addFields: {
                    "status": { $arrayElemAt: ["$status", 0] }
                }
            }
        ];
        return this.getAggregationData(pipeline);
    }

    static fetchPendingNotificationRequest(groupId, userId, notificationType, additionalField, fieldId) {
        let comparedTime = Date.now() - 86400000;
        const pipeline = [
            {
                $match: { "userId": new mongodb.ObjectId(userId), "notificationType": notificationType, [additionalField]: new mongodb.ObjectId(fieldId) }
            },
            {
                $addFields: {
                    "status": { $slice: ["$status", -1] },
                }
            },
            {
                $addFields: {
                    "status": { $arrayElemAt: ["$status", 0] }
                }
            },
            {
                $addFields: {
                    "status": "$status.value",
                    "groupId": "$data.groupId",
                    "notificationExpired": { $lt: ["$creationTime", comparedTime] }
                }
            },
            {
                $match: { "status": "Unresolved", "groupId": new mongodb.ObjectId(groupId), "notificationExpired": false }
            }
        ];
        return this.getAggregationData(pipeline);
    }

    static fetchUserNotification(userId) {
        const pipeline = [
            {
                $match: { "userId": new mongodb.ObjectId(userId) }
            },
            {
                $lookup:
                {
                    from: 'user_notification_settings',
                    localField: 'userId',
                    foreignField: 'userId',
                    as: "userNotificationSettingsData"
                }
            },
            {
                $unwind: {
                    "path": "$userNotificationSettingsData",
                    "preserveNullAndEmptyArrays": false
                }
            },
            {
                $addFields: {
                    "key": {
                        $switch: {
                            branches: [
                                {
                                    case: {
                                        $eq: [
                                            "$type", "Information"
                                        ]
                                    },
                                    then: {
                                        $cond: {
                                            "if": { $eq: ["$userNotificationSettingsData.data.Information", 1] },
                                            then: true,
                                            "else": false
                                        }
                                    }
                                },
                                {
                                    case: { $eq: ["$type", "Error"] }, then: {
                                        $cond: {
                                            "if": { $eq: ["$userNotificationSettingsData.data.Error", 1] },
                                            then: true,
                                            "else": false
                                        }
                                    }
                                },
                                {
                                    case: { $eq: ["$type", "Warning"] }, then: {
                                        $cond: {
                                            "if": { $eq: ["$userNotificationSettingsData.data.Warning", 1] },
                                            then: true,
                                            "else": false
                                        }
                                    }
                                }
                            ],
                            default: 0
                        }

                    }
                }
            },

            {
                $match: {
                    "key": true
                }
            },
            {
                $addFields: {
                    "status": { $slice: ["$status", -1] },
                }
            },
            {
                $addFields: {
                    "status": { $arrayElemAt: ["$status", 0] }
                }
            },
            {
                $addFields: {
                    "statusValue": "$status.value"
                }
            },
            {
                $match: { "statusValue": { $ne: "Resolved" } }
            },
            {
                $project: {
                    "_id": 0,
                    "notificationId": "$$ROOT._id",
                    "title": "$$ROOT.title",
                    "type": "$$ROOT.type",
                    "notificationType": "$$ROOT.notificationType",
                    "status": "$$ROOT.status",
                    "isActionable": "$$ROOT.isActionable",
                    "creationTime": "$$ROOT.creationTime",
                    // "imageUrl": "$$ROOT.imageUrl",
                    "message": "$$ROOT.message",
                    "data": "$$ROOT.data"
                }
            }

        ];
        return this.getAggregationData(pipeline);
    }

    static fetchUserNotificationV2(userId, limit, offset) {
        const pipeline = [
            {
                $match: { "userId": new mongodb.ObjectId(userId) }
            },
            {
                $lookup:
                {
                    from: 'user_notification_settings',
                    localField: 'userId',
                    foreignField: 'userId',
                    as: "userNotificationSettingsData"
                }
            },
            {
                $unwind: {
                    "path": "$userNotificationSettingsData",
                    "preserveNullAndEmptyArrays": false
                }
            },
            {
                $addFields: {
                    "key": {
                        $switch: {
                            branches: [
                                {
                                    case: {
                                        $eq: [
                                            "$type", "Information"
                                        ]
                                    },
                                    then: {
                                        $cond: {
                                            "if": { $eq: ["$userNotificationSettingsData.data.Information", 1] },
                                            then: true,
                                            "else": false
                                        }
                                    }
                                },
                                {
                                    case: { $eq: ["$type", "Error"] }, then: {
                                        $cond: {
                                            "if": { $eq: ["$userNotificationSettingsData.data.Error", 1] },
                                            then: true,
                                            "else": false
                                        }
                                    }
                                },
                                {
                                    case: { $eq: ["$type", "Warning"] }, then: {
                                        $cond: {
                                            "if": { $eq: ["$userNotificationSettingsData.data.Warning", 1] },
                                            then: true,
                                            "else": false
                                        }
                                    }
                                }
                            ],
                            default: 0
                        }

                    }
                }
            },

            {
                $match: {
                    "key": true
                }
            },
            {
                $addFields: {
                    "status": { $slice: ["$status", -1] },
                }
            },
            {
                $addFields: {
                    "status": { $arrayElemAt: ["$status", 0] }
                }
            },
            {
                $addFields: {
                    "statusValue": "$status.value"
                }
            },
            {
                $match: { "statusValue": { $ne: "Resolved" } }
            },
            {
                $sort: { "creationTime": -1 }
            },
            {
                $skip: offset
            },
            {
                $limit: limit
            },
            {
                $project: {
                    "_id": 0,
                    "notificationId": "$$ROOT._id",
                    "title": "$$ROOT.title",
                    "type": "$$ROOT.type",
                    "notificationType": "$$ROOT.notificationType",
                    "status": "$$ROOT.status",
                    "isActionable": "$$ROOT.isActionable",
                    "creationTime": "$$ROOT.creationTime",
                    // "imageUrl": "$$ROOT.imageUrl",
                    "message": "$$ROOT.message",
                    "data": "$$ROOT.data"
                }
            }

        ];
        return this.getAggregationData(pipeline);
    }

    static fetchGroupNotification(groupId) {
        const pipeline = [
            {
                $project: {
                    "_id": 1,
                    "groupId": "$data.groupId"
                }
            },
            {
                $match: { "groupId": new mongodb.ObjectId(groupId) }
            },
            {
                $project: {
                    "_id": 1,
                }
            }
        ];
        return this.getAggregationData(pipeline);
    }

    static findAndUpdate(_id) {
        let pushQuery = {};
        pushQuery["status"] = { "value": "Resolved", "timestamp": Date.now() };
        return db
            .findOneAndUpdate({ "_id": new mongodb.ObjectId(_id) }, { $push: pushQuery }, { returnOriginal: false });
    }

    static fetchActionableNotification(entityId, query) {
        let queryObject = {};
        queryObject = {
            "isActionable": true,
            [query]: entityId
        };
        const pipeline = [
            {
                $match: queryObject
            }
        ];
        return this.getAggregationData(pipeline);
    }

    static deleteNotificationData(ids) {
        return this.deleteById(ids);
    }

}