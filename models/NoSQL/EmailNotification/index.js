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
const QueryExecutor = require('../NoSQLEntities');


module.exports = class EmailNotification extends QueryExecutor {
    constructor(_id, title, email, type, notificationType, status, data, isActionable, creationTime, message) {
        super("notifications");
        this._id = _id ? new mongodb.ObjectId(_id) : null;
        this.title = title;
        this.email = email;
        this.type = type;
        this.notificationType = notificationType;
        this.status = status;
        this.data = data;
        this.isActionable = isActionable;
        this.creationTime = creationTime;
        this.message = message;
    }

    insertNewEmailNotificationData(notificatonData) {
        if (this._id) {
            return this.updateSingelDataSet([{ _id: this._id }, { $set: this }]);
        } else {
            if (automationData == null) {
                return this.save(this);
            } else {
                return this.save(notificatonData);
            }
        }
    }

    static aggregationToCheckPendingGroupTransferRequest(groupId, email) {
        const pipeline = [
            {
                $match: { "email": email, "notificationType": "groupOwnershipTransferRequest" }
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
                $match: { "status": "Unresolved", "groupId": groupId, "notificationExpired": false }
            }
        ];
        return this.getAggregationData(pipeline);
    }

    static aggregationToCheckPendingGroupInviteRequest(groupId, email) {
        const pipeline = [
            {
                $match: { "email": email, "notificationType": "groupInvitation" }
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
                $match: { "status": "Unresolved", "groupId": groupId, "notificationExpired": false }
            }
        ];
        return this.getAggregationData(pipeline);
    }

    static aggregationToGetPendingGroupInviteRequestEmail(groupId) {
        const pipeline = [
            {
                $match: { 
                    "data.groupId": groupId,
                    "notificationType": "groupInvitation" 
                }
            },
            {
                $addFields:{
                    "status": { $slice: ["$status", -1] }
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
                $match: {
                    "status": "Unresolved",
                    "groupId": groupId,
                    "notificationExpired": false
                }
            },
            {
                $project: {
                    _id: 0,
                    id: "$_id",
                    email: 1
                }
            }
        ];
        return this.getAggregationData(pipeline);
    }

    static aggregationToGetEmailNotificationData(email) {
        const pipeline = [
            {
                $match: { "email": email }
            },
            {
                $addFields: {
                    "statusValue": { $slice: ["$status", -1] },
                }
            },
            {
                $addFields: {
                    "statusValue": { $arrayElemAt: ["$statusValue", 0] }
                }
            },
            {
                $addFields: {
                    "statusValue": "$statusValue.value"
                }
            },
            {
                $match: { "statusValue": { $ne: "Resolved" } }
            },
            {
                $project: {
                    "_id": 0,
                    "title": 1,
                    "type": 1,
                    "notificationType": 1,
                    "status": 1,
                    "data": 1,
                    "isActionable": 1,
                    "creationTime": 1,
                    // "imageUrl": 1,
                    "message": 1
                }
            }
        ];
        return this.getAggregationData(pipeline);
    }

    static deleteUserEmailNotifications(email) {
        let deleteQuery = {"email": email}
        return this.deleteByEntityName(deleteQuery);
    }

}