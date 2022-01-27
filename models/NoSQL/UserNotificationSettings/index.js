const mongodb = require('mongodb');
const QueryExecutor = require('../NoSQLEntities');

class UserNotificationSettings extends QueryExecutor {
    constructor(_id, userId, data, creationTime, updationTime) {
        this._id = _id ? new mongodb.ObjectId(_id) : null;
        this.userId = userId;
        this.data = data;
        this.creationTime = creationTime;
        this.updationTime = updationTime;
    }

    insertUserNotificationSettingsData() {
        if (this._id) {
            return this.updateSingelDataSet([{ _id: this._id }, { $set: this }]);
        } else {
            return this.save(this);
        }
    }

    static getCurrentUserNotificationSettingData(userId) {
        let findObj = { "userId": userId };
        const projectObj = { "_id": 0, "data": 1 };
        return this.findAndProjectDataByOtherEntities(findObj, projectObj);
    }

    static getUserNotificationSettingDataViaAggregation(userId) {
        let pipeline = [
            {
                $match:
                {
                    "userId": userId
                }
            }
        ];
        return this.getAggregationData(pipeline);
    }
}

module.exports = UserNotificationSettings;