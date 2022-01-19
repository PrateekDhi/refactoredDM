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
 *
 * 
**/

const mongodb = require('mongodb');
const getDb = require('../../../utils/databases/mongo').getDb;
const db = getDb().collection('notifications');
const DatabaseServerError = require('../../../errors/database_server_error');
const Aggregation = require('../../NoSQLEntities');


class Notifications extends Aggregation {
    constructor(_id, title, userId, type, notificationType, status, data, isActionable, creationTime, imageUrl, message) {
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

    save() {
        let dbOp;
        if (this._id) {
            dbOp = db
                .updateOne({ _id: this._id }, { $set: this });
        } else {
            dbOp = db
                .insertOne(this);
        }
        return dbOp;
    }


    aggregate(pipeline) {
        db.aggregate(pipeline)
            .toArray()
            .then(res => {
                return res;
            }).catch(err => {
                throw new DatabaseServerError();
            })
    }


    static async fetchAggregation(_id) {
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
        try {
            const result = await this.aggregate(pipeline);
            return result;
        } catch (e) {
            throw new DatabaseServerError();
        }
    }

    static async fetchPendingNotificationRequest(groupId, userId, notificationType, additionalField, fieldId) {
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
        try {
            const result = await this.aggregate(pipeline);
            return result;
        } catch (error) {
            throw new DatabaseServerError();
        }
    }

    static async fetchUserNotification(userId) {
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
        try {
            const result = await this.aggregate(pipeline);
            return result;
        } catch (error) {
            throw new DatabaseServerError();
        }
    }

    static async fetchUserNotificationV2(userId, limit, offset) {
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
        try {
            const result = await this.aggregate(pipeline);
            return result;
        } catch (error) {
            throw new DatabaseServerError();
        }
    }

    static async fetchGroupNotification(groupId) {
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
        try {
            const result = await this.aggregate(pipeline);
            return result;
        } catch (error) {
            throw new DatabaseServerError();
        }
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
        try {
            const result = await this.aggregate(pipeline);
            return result;
        } catch (error) {
            throw new DatabaseServerError();
        }
    }

    static deleteById(id) {
        // const db = getDb().collection('automations');
        if (id.length > 1) {
            return db
                .deleteMany({ _id: { $in: id } })
        } else {
            return db
                .deleteOne({ _id: new mongodb.ObjectId(id[0]) })
        }
    }

}