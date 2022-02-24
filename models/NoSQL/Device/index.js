const mongodb = require('mongodb');
const getDb = require('../../../utils/databases/mongo').getDb;
const QueryExecutor = require('../NoSQLEntities');
class Device extends QueryExecutor {
  constructor(_id, ownerId, groupId, categoryId, type, manufacturerName, primaryTopic, secondaryTopic, creationTime, updationTime, location, additionalDeviceDetails, controllable) {
    super("devices")
    this._id = _id ? new mongodb.ObjectId(_id) : null;
    this.ownerId = ownerId;
    this.groupId = groupId;
    this.categoryId = categoryId;
    this.type = type;
    this.manufacturerName = manufacturerName;
    this.primaryTopic = primaryTopic;
    this.secondaryTopic = secondaryTopic;
    this.creationTime = creationTime;
    this.updationTime = updationTime;
    this.location = location;
    this.additionalDeviceDetails = additionalDeviceDetails;
    this.controllable = controllable;
  }

  /**
   * 
   * @author Prateek Shukla
   * @description The function is used to create or update a device, if _id is present in the instance then it will be updated 
   * but if _id is not present in the instance it will be created
   * @param - none
   * @returns {Promise} - Unresolved Promise containing mongo query
   * @throws Database server error, Internal server error
   * @todo none
   * 
  **/
  insertNewDeviceData() {
    if (this._id) {
      return this.updateSingelDataSet([{ _id: this._id }, { $set: this }]);
    } else {
      return this.save(this);
    }
  }

  static getDeviceCount(id, conditionalEntity, entityId) {
    if (typeof(id) == 'object') {
      let countObj = { "_id": { $in: id }, [conditionalEntity]: entityId };
      return this.getCount(countObj);
    } else {
      let countObj = { "_id": id, [conditionalEntity]: entityId };
      return this.getCount(countObj);
    }
  }


  static getGivenDeviceDataById(ids, fieldName) {
    const projectObj = {};
    projectObj[fieldName] = 1;
    return this.findAndProjectDataById(ids, projectObj);
  }

  static getDeviceIdBygroupId(groupId) {
    let findObj = { "groupId": new mongodb.ObjectId(groupId) };
    let projectObj = { "_id": 1 };
    return this.findAndProjectDataByOtherEntities(findObj, projectObj);
  }

  static getDeviceIdBygroupIdAndCategoryId(groupId, categoryId) {
    let findObj = { "groupId": new mongodb.ObjectId(groupId), "categoryId": new mongodb.ObjectId(categoryId) };
    let projectObj = { "_id": 1 };
    return this.findAndProjectDataByOtherEntities(findObj, projectObj);
  }

  // currently not being used in dm_development
  static getDeviceIdByPrimaryTopic(primaryTopic) {
    let findObj = { "primaryTopic": primaryTopic };
    let projectObj = { "_id": 1 };
    return this.findAndProjectDataByOtherEntities(findObj, projectObj);
  }


  static getDeviceCountByGroupIds(groupIds) {
    const pipeline = [
      {
        $match: { groupId: { $in: groupIds } }
      },
      {
        $group: {
          "_id": "$groupId",
          "devices": { $push: "$_id" },
        }
      },
      {
        $project: {
          "_id": 0,
          "groupId": "$_id",
          "groupDeviceCount": { $cond: { if: { $isArray: "$devices" }, then: { $size: "$devices" }, else: "NA" } }
        }
      }
    ];
    return this.getAggregationData(pipeline);
  }

  static getAveragePowerConsumptionsForGroupIds(groupIds) {
    let pipeline = [
      {
        $match: { groupId: { $in: groupIds }, type: { $in: powerGivingDevices } }   //Also add device type here to ensure only devices that can have power value are present
      },
      {
        $lookup:
        {
          from: 'devices_data',
          localField: '_id',
          foreignField: 'deviceId',
          as: "deviceData"
        }
      },
      {
        $unwind: "$deviceData"
      },  //Add another $match pipeline to filter out only the power value of the device
      {
        $project: {
          "_id": 1,
          "groupId": 1,
          "dataType": { $substr: ["$deviceData.dataType", 0, 5] },
          "day": "$deviceData.day",
          "numberOfSamples": "$deviceData.numberOfSamples",
          "total": "$deviceData.total",
          "hour": "$deviceData.hour"
        }
      },
      {
        $match: {
          $and: [
            { "day": { "$gte": day } },
            { "day": { "$lte": day } }
          ],
          "dataType": "power"
        }
      },
      {
        $group: {
          "_id": "$_id",
          "groupId": { $first: "$groupId" },
          "day": { $first: "$day" },
          "totalData": { $sum: "$total" },
          "totalNumberOfSamples": { $sum: "$numberOfSamples" }
          // "averagePowerForDevice":{$divide:[{$sum:"$total"},{$sum:"$numberOfSamples"}]}
        }
      },
      {
        $project: {
          "groupId": 1,
          "day": 1,
          "averagePowerForDevice": { $divide: ["$totalData", "$totalNumberOfSamples"] }
        }
      },
      {
        $group: {
          "_id": "$groupId",
          "groupAveragePowerConsumption": { $sum: "$averagePowerForDevice" }
        }
      },
      {
        $project: {
          "_id": 0,
          "groupId": "$_id",
          "groupAveragePowerConsumption": 1
        }
      }
    ];
    return this.getAggregationData(pipeline);
  }

  static aggregateDevicesDataByIds(deviceIds) {
    let pipeline = [
      {
        $match: { _id: { $in: deviceIds } }
      },
      {
        $lookup:
        {
          from: 'devices_data',
          localField: '_id',
          foreignField: 'deviceId',
          as: "deviceData"
        }
      },
      {
        $unwind: {
          "path": "$deviceData",
          "preserveNullAndEmptyArrays": true
        }
      },
      {
        $project: {
          "name": 1,
          "groupId": 1,
          "categoryId": 1,
          "type": 1,
          "manufacturerName": 1,
          "location": 1,
          "additionalDeviceDetails": 1,
          "controllable": 1,
          "creationTime": 1,
          "updationTime": 1,
          "day": "$deviceData.day",
          "hour": "$deviceData.hour",
          "last": "$deviceData.last",
          "data": "$deviceData.samples",
          "dataType": "$deviceData.dataType"
        }
      },
      {
        $addFields: {
          "data": { $slice: ["$data", -1] },
        }
      },
      {
        $addFields: {
          "data": { $arrayElemAt: ["$data", 0] }
        }
      },
      {
        $addFields: {
          "data.value": {
            $cond:
            {
              if:
              {
                $or: [
                  { $eq: ["$dataType", "power"] },
                  { $eq: ["$dataType", "power1"] },
                  { $eq: ["$dataType", "power2"] },
                  { $eq: ["$dataType", "power3"] }
                ]
              },
              then: { $round: [{ $multiply: ["$data.value", 1000] }, 0] },
              else: "$data.value"
            }
          }
        }
      },
      {
        $addFields: {
          "data": [{ "k": "$dataType", "v": "$data" }]
        }
      },
      {
        $addFields: {
          "data": { $arrayToObject: "$data" }
        }
      },
      {
        $sort:
        {
          "day": 1,
          "hour": 1,
          "last": 1
        }
      },
      {
        $group:
        {
          "_id": {
            "deviceId": "$_id",
            "dataType": "$dataType"
          },
          "lastData": { $last: "$$ROOT" }
        }
      },
      {
        $group:
        {
          "_id": "$_id.deviceId",
          "name": { $first: "$lastData.name" },
          "groupId": { $first: "$lastData.groupId" },
          "categoryId": { $first: "$lastData.categoryId" },
          "type": { $first: "$lastData.type" },
          "manufacturerName": { $first: "$lastData.manufacturerName" },
          "location": { $first: "$lastData.location" },
          "additionalDeviceDetails": { $first: "$lastData.additionalDeviceDetails" },
          "controllable": { $first: "$lastData.controllable" },
          "creationTime": { $first: "$lastData.creationTime" },
          "updationTime": { $first: "$lastData.updationTime" },
          "data": { $addToSet: "$lastData.data" }
        }
      },
      {
        $addFields: {
          "data": { $mergeObjects: "$data" }
        }
      },
      {
        $lookup:
        {
          from: 'devices_status',
          localField: '_id',
          foreignField: 'deviceId',
          as: "deviceStatus"
        }
      },
      {
        $unwind: {
          "path": "$deviceStatus",
          "preserveNullAndEmptyArrays": true
        }
      },
      {
        $project: {
          "name": 1,
          "groupId": 1,
          "categoryId": 1,
          "type": 1,
          "manufacturerName": 1,
          "location": 1,
          "additionalDeviceDetails": 1,
          "controllable": 1,
          "creationTime": 1,
          "updationTime": 1,
          "data": 1,
          "day": "$deviceStatus.day",
          "hour": "$deviceStatus.hour",
          "status": "$deviceStatus.status"
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
        $sort:
        {
          "day": 1,
          "hour": 1,
          "last": 1
        }
      },
      {
        $group:
        {
          _id: "$_id",
          lastData: { $last: "$$ROOT" }
        }
      },
      {
        $project: {
          "_id": 0,
          "deviceId": "$_id",
          "name": "$lastData.name",
          "groupId": "$lastData.groupId",
          "categoryId": "$lastData.categoryId",   //Removed ownerid for now
          "type": "$lastData.type",
          "manufacturerName": "$lastData.manufacturerName",
          "location": "$lastData.location",
          "additionalDeviceDetails": "$lastData.additionalDeviceDetails",
          "controllable": "$lastData.controllable",
          "creationTime": "$lastData.creationTime",
          "updationTime": "$lastData.updationTime",
          "data": "$lastData.data",
          "status": "$lastData.status"
        }
      },
      {
        $addFields: {
          "status": {
            $cond:
            {
              if:
              {
                $eq: ["$status", null]
              },
              then: { "value": 1, "timestamp": Date.now() },
              else: "$status"
            }
          }
        }
      }
      // {
      //     $addFields:{
      //         "data":                     {
      //             $cond: 
      //             { 
      //                 if: 
      //                 { 
      //                 $eq: ["$data", null ]
      //                 }, 
      //                 then: {"value":0,"timestamp":Date.now()}, 
      //                 else: "$data" 
      //             }
      //         },
      //         "status":                     {
      //         $cond: 
      //         { 
      //             if: 
      //             { 
      //                 $eq: ["$status", null ]
      //             }, 
      //             then: {"value":1,"timestamp":Date.now()}, 
      //             else: "$status" 
      //         }
      //         }
      //     }
      // }
    ];
    return this.getAggregationData(pipeline);
  }


  static getAggregationDataByDateTimeTypeForGroupId(dataTimeType, groupId, day1, day2) {
    let powerGivingDevices = ["powerLight", "TriCurrentVoltageSwitch", "ac", "compressor", "levelCurrentFan", "currentVoltageLight"];
    let pipeline;
    switch (dataTimeType) {
      case "daily":
        pipeline = [
          {
            $match: { "groupId": groupId, "type": { $in: powerGivingDevices } }   //Also add device type here to ensure only devices that can have power value are present
          },
          {
            $lookup:
            {
              from: 'devices_data',
              localField: '_id',
              foreignField: 'deviceId',
              as: "deviceData"
            }
          },
          {
            $unwind: "$deviceData"
          },  //Add another $match pipeline to filter out only the power value of the device
          {
            $project: {
              "_id": 1,
              "groupId": 1,
              "dataType": { $substr: ["$deviceData.dataType", 0, 5] },
              "day": "$deviceData.day",
              "numberOfSamples": "$deviceData.numberOfSamples",
              "total": "$deviceData.total",
              "hour": "$deviceData.hour"
            }
          },
          {
            $match: {
              $and: [
                { "day": { "$gte": day1 } },
                { "day": { "$lte": day2 } }
              ],
              "dataType": "power"
            }
          },
          {
            $project: {
              "_id": 0,
              "deviceId": 1,
              "groupId": 1,
              "day": 1,
              "hour": 1,
              "hourAverage": { $divide: ["$total", "$numberOfSamples"] },
            }
          },
          {
            $group: {
              "_id": "$hour",
              "day": { $first: "$day" },
              "totalGroupAveragePowerConsumptionPerHour": { $sum: "$hourAverage" }
            }
          },
          {
            $project: {
              "_id": 0,
              "day": 1,
              "hour": "$_id",
              "totalGroupAveragePowerConsumptionPerHour": 1
            }
          },
          {
            $sort: { "day": 1, "hour": 1 }
          }
        ];
        break;

      case "weekly":
      case "monthly":
        pipeline = [
          {
            $match: { "groupId": groupId, "type": { $in: powerGivingDevices } }   //Also add device type here to ensure only devices that can have power value are present
          },
          {
            $lookup:
            {
              from: 'devices_data',
              localField: '_id',
              foreignField: 'deviceId',
              as: "deviceData"
            }
          },
          {
            $unwind: "$deviceData"
          },  //Add another $match pipeline to filter out only the power value of the device
          {
            $project: {
              "_id": 0,
              "deviceId": "$_id",
              "groupId": 1,
              "dataType": { $substr: ["$deviceData.dataType", 0, 5] },
              "day": "$deviceData.day",
              "numberOfSamples": "$deviceData.numberOfSamples",
              "total": "$deviceData.total",
              "hour": "$deviceData.hour"
            }
          },
          {
            $match: {
              $and: [
                { "day": { "$gte": day1 } },
                { "day": { "$lte": day2 } }
              ],
              "dataType": "power"
            }
          },
          {
            $group: {
              "_id": { "deviceId": "$deviceId", "day": "$day" },
              "dayTotal": { $sum: "$total" },
              "dayNumberOfSamples": { $sum: "$numberOfSamples" }
            }
          },
          {
            $project: {
              "_id": 0,
              "deviceId": "$_id.deviceId",
              "day": "$_id.day",
              "dayAverageForDevice": { $divide: ["$dayTotal", "$dayNumberOfSamples"] },
            }
          },
          {
            $group: {
              "_id": "$day",
              "totalGroupAveragePowerConsumptionPerDay": { $sum: "$dayAverageForDevice" }
            }
          },
          {
            $project: {
              "_id": 0,
              "day": "$_id",
              "totalGroupAveragePowerConsumptionPerDay": 1
            }
          },
          {
            $sort: { "day": 1 }
          }
        ];
        break;

      case "yearly":

        break;
    }

    return this.getAggregationData(pipeline);
  }


  static getAggregationDataByDateTimeTypeForCategoryId(dataTimeType, groupId, categoryId, day1, day2) {
    let powerGivingDevices = ["powerLight"];
    let pipeline;
    switch (dataTimeType) {
      case "daily":
        pipeline = [
          {
            $match: { "groupId": groupId, "categoryId": categoryId, "type": { $in: powerGivingDevices } }   //Also add device type here to ensure only devices that can have power value are present
          },
          {
            $lookup:
            {
              from: 'devices_data',
              localField: '_id',
              foreignField: 'deviceId',
              as: "deviceData"
            }
          },
          {
            $unwind: "$deviceData"
          },  //Add another $match pipeline to filter out only the power value of the device
          {
            $project: {
              "_id": 1,
              "groupId": 1,
              "dataType": "$deviceData.dataType",
              "day": "$deviceData.day",
              "numberOfSamples": "$deviceData.numberOfSamples",
              "total": "$deviceData.total",
              "hour": "$deviceData.hour"
            }
          },
          {
            $match: {
              $and: [
                { "day": { "$gte": day1 } },
                { "day": { "$lte": day2 } }
              ],
              "dataType": "power"
            }
          },
          {
            $project: {
              "_id": 0,
              "deviceId": 1,
              "groupId": 1,
              "day": 1,
              "hour": 1,
              "hourAverage": { $divide: ["$total", "$numberOfSamples"] },
            }
          },
          {
            $group: {
              "_id": "$hour",
              "day": { $first: "$day" },
              "totalAveragePowerConsumptionPerHour": { $sum: "$hourAverage" }
            }
          },
          {
            $project: {
              "_id": 0,
              "day": 1,
              "hour": "$_id",
              "totalAveragePowerConsumptionPerHour": 1
            }
          },
          {
            $sort: { "day": 1, "hour": 1 }
          }
        ];
        break;

      case "weekly":
      case "monthly":
        pipeline = [
          {
            $match: { "groupId": groupId, "categoryId": categoryId, "type": { $in: powerGivingDevices } }   //Also add device type here to ensure only devices that can have power value are present
          },
          {
            $lookup:
            {
              from: 'devices_data',
              localField: '_id',
              foreignField: 'deviceId',
              as: "deviceData"
            }
          },
          {
            $unwind: "$deviceData"
          },  //Add another $match pipeline to filter out only the power value of the device
          {
            $project: {
              "_id": 0,
              "deviceId": "$_id",
              "groupId": 1,
              "dataType": "$deviceData.dataType",
              "day": "$deviceData.day",
              "numberOfSamples": "$deviceData.numberOfSamples",
              "total": "$deviceData.total",
              "hour": "$deviceData.hour"
            }
          },
          {
            $match: {
              $and: [
                { "day": { "$gte": day1 } },
                { "day": { "$lte": day2 } }
              ],
              "dataType": "power"
            }
          },
          {
            $group: {
              "_id": { "deviceId": "$deviceId", "day": "$day" },
              "dayTotal": { $sum: "$total" },
              "dayNumberOfSamples": { $sum: "$numberOfSamples" }
            }
          },
          {
            $project: {
              "_id": 0,
              "deviceId": "$_id.deviceId",
              "day": "$_id.day",
              "dayAverageForDevice": { $divide: ["$dayTotal", "$dayNumberOfSamples"] },
            }
          },
          {
            $group: {
              "_id": "$day",
              "totalAveragePowerConsumptionPerDay": { $sum: "$dayAverageForDevice" }
            }
          },
          {
            $project: {
              "_id": 0,
              "day": "$_id",
              "totalAveragePowerConsumptionPerDay": 1
            }
          },
          {
            $sort: { "day": 1 }
          }
        ];
        break;

      case "yearly":

        break;
    }

    return this.getAggregationData(pipeline);
  }

  static checkDeviceStausAggregation(deviceIds){
    let pipeline = [
      {
          $match: { _id: deviceIds }
      },
      {
          $lookup:
          {
              from: 'devices_status',
              localField: '_id',
              foreignField: 'deviceId',
              as: "deviceStatus"
          }
      },
      {
          $unwind: {
              "path": "$deviceStatus",
              "preserveNullAndEmptyArrays": true
          }
      },
      {
          $project: {
              "day": "$deviceStatus.day",
              "hour": "$deviceStatus.hour",
              "status": "$deviceStatus.status"
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
          $sort:
          {
              "day": 1,
              "hour": 1
          }
      },
      {
          $group:
          {
              _id: "$_id",
              lastData: { $last: "$$ROOT" }
          }
      },
      {
          $project: {
              "_id": 0,
              "deviceId": "$_id",
              "status": "$lastData.status"
          }
      },
      {
          $addFields: {
              "status": {
                  $cond:
                  {
                      if:
                      {
                          $eq: ["$status", null]
                      },
                      then: { "value": 1, "timestamp": Date.now() },
                      else: "$status"
                  }
              }
          }
      }
  ];
    return this.getAggregationData(pipeline);
  }


  static getDeviceDataById(ids){
    return this.findById(ids);
  }


  static aggregationForRemovingDeicesFromControlList(deviceIds){
    let pipeline = [
      {
          $match: { "_id": { $in: deviceIds } }
      },
      {
          $lookup:
          {
              from: 'devices_status',
              localField: '_id',
              foreignField: 'deviceId',
              as: "deviceStatus"
          }
      },
      {
          $unwind: {
              "path": "$deviceStatus",
              "preserveNullAndEmptyArrays": true
          }
      },
      {
          $project: {
              "day": "$deviceStatus.day",
              "hour": "$deviceStatus.hour",
              "status": "$deviceStatus.status"
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
          $sort:
          {
              "day": 1,
              "hour": 1
          }
      },
      {
          $group:
          {
              _id: "$_id",
              lastData: { $last: "$$ROOT" }
          }
      },
      {
          $project: {
              "_id": 0,
              "deviceId": "$_id",
              "status": "$lastData.status"
          }
      },
      {
          $addFields: {
              "status": {
                  $cond:
                  {
                      if:
                      {
                          $eq: ["$status", null]
                      },
                      then: { "value": 1, "timestamp": Date.now() },
                      else: "$status"
                  }
              }
          }
      },
      {
          $match: { "status.value": 1 }
      }
  ];
    return this.getAggregationData(pipeline);
  }


  static aggregationForGettingDevicesPublishingData(deviceIds){
    let pipeline = [
      {
          $match: { _id: { $in: devicesData.map(function (edd) { return edd.deviceId }) } }
      },
      {
          $lookup:
          {
              from: 'devices_data',
              localField: '_id',
              foreignField: 'deviceId',
              as: "deviceData"
          }
      },
      {
          $unwind: {
              "path": "$deviceData",
              "preserveNullAndEmptyArrays": true
          }
      },
      {
          $project: {
              "groupId": 1,
              "type": 1,
              "secondaryTopic": 1,
              "day": "$deviceData.day",
              "hour": "$deviceData.hour",
              "last": "$deviceData.last",
              "data": "$deviceData.samples",
              "dataType": "$deviceData.dataType"
          }
      },
      {
          $addFields: {
              "data": { $slice: ["$data", -1] },
          }
      },
      {
          $addFields: {
              "data": { $arrayElemAt: ["$data", 0] }
          }
      },
      {
          $addFields: {
              "data": [{ "k": "$dataType", "v": "$data" }]
          }
      },
      {
          $addFields: {
              "data": { $arrayToObject: "$data" }
          }
      },
      {
          $sort:
          {
              "day": 1,
              "hour": 1,
              "last": 1
          }
      },
      {
          $group:
          {
              "_id": {
                  "deviceId": "$_id",
                  "dataType": "$dataType"
              },
              "lastData": { $last: "$$ROOT" }
          }
      },
      {
          $group:
          {
              "_id": "$_id.deviceId",
              "groupId": { $first: "$lastData.groupId" },
              "type": { $first: "$lastData.type" },
              "secondaryTopic": { $first: "$lastData.secondaryTopic" },
              "currentData": { $addToSet: "$lastData.data" }
          }
      },
      {
          $project: {
              "_id": 0,
              "deviceId": "$_id",
              "groupId": 1,
              "type": 1,
              "secondaryTopic": 1,
              "currentData": 1
          }
      },
      {
          $addFields: {
              "currentData": { $mergeObjects: "$currentData" }
          }
      }
  ];
    return this.getAggregationData(pipeline);
  }

  // static fetchAll() {
  //   const db = getDb();
  //   return db
  //     .collection('devices')
  //     .find()
  //     .toArray()
  //   //   .then(devices => {
  //   //     return devices;
  //   //   })
  //   //   .catch(err => {
  //   //     console.log(err);
  //   //   });
  // }

  // static findById(id) {
  //   const db = getDb();
  //   return db
  //     .collection('devices')
  //     .find({ _id: new mongodb.ObjectId(id) })
  //     .next()
  //   //   .then(device => {
  //   //     return device;
  //   //   })
  //   //   .catch(err => {
  //   //     console.log(err);
  //   //   });
  // }

  // static deleteById(id) {
  //   const db = getDb();
  //   return db
  //     .collection('devices')
  //     .deleteOne({ _id: new mongodb.ObjectId(id) })
  //   //   .then(result => {
  //   //     console.log('Deleted');
  //   //   })
  //   //   .catch(err => {
  //   //     console.log(err);
  //   //   });
  // }
}

module.exports = Device;
