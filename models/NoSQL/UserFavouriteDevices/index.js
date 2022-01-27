const mongodb = require('mongodb');
const QueryExecutor = require('../NoSQLEntities');

class UserFavouriteDevices extends QueryExecutor{
  constructor(_id, deviceId, userId) {
    this._id = _id ? new mongodb.ObjectId(_id) : null;
    this.deviceId = deviceId;
    this.userId = userId;
  }

insertUserFavouriteDeviceData() {
    if (this._id) {
      return this.updateSingelDataSet([{ _id: this._id }, { $set: this }]);
    } else {
          return this.save(this);
    }
  }

static getUserFavouriteDevicesList(deviceIds, userId) {
    let findObj = { "deviceId": { $in: deviceIds }, "userId": userId };
    const projectObj = { "_id": 0, "deviceId": 1 };
    return this.findAndProjectDataByOtherEntities(findObj, projectObj);
  }

static getFavouriteDeviceCount(deviceId, userId){
      let countObj = { "deviceId": deviceId, "userId": userId }
      return this.getCount(countObj);
  }

  static getFavouriteDevicesIdsViaAggregation(userId, groupIds) {
    let pipeline = [
        {
            $match: { "userId": userId }
        },
        {
            $lookup:
            {
                from: 'devices',
                localField: 'deviceId',
                foreignField: '_id',
                as: "deviceData"
            }
        },
        {
            $unwind: "$deviceData"
        },
        {
            $match: { "deviceData.groupId": { $in: groupIds } }
        }
    ];
    return this.getAggregationData(pipeline);
  }

  static deleteDevicesFromUserFavouriteList(deviceId, userId){
      let deleteObj = { "deviceId": deviceId, "userId": userId };
    return this.deleteByOtherEntities(deleteObj);
  }
}

module.exports = UserFavouriteDevices;