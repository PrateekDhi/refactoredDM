const mongodb = require('mongodb');
const getDb = require('../../../utils/databases/mongo').getDb;
const QueryExecutor = require('../NoSQLEntities');

class DevicesData extends QueryExecutor{
  constructor(_id, dataType, day, deviceId, hour, first, last, numberOfSamples, samples, total) {
    this._id = _id ? new mongodb.ObjectId(_id) : null;
    this.dataType = dataType;
    this.day = day;
    this.deviceId = deviceId;
    this.hour = hour;
    this.first = first;
    this.last = last;
    this.numberOfSamples = numberOfSamples;
    this.samples = samples;
    this.total = total;
  }

/**
 * 
 * @author Prateek Shukla
 * @description The function is used to create or update a device data entry, device data is saved on hourly basis, if _id is present in the instance then it will be updated 
 * but if _id is not present in the instance it will be created
 * @param - none
 * @returns {Promise} - Unresolved Promise containing mongo query
 * @throws Database server error, Internal server error
 * @todo none
 * 
**/

insertNewDevicesData() {
  if (this._id) {
    return this.updateSingelDataSet([{ _id: this._id }, { $set: this }]);
  } else {
    return this.save(this);
  }
}

static getAggregationData(deviceId,actionType) {
  let pipeline = [
    {
        $match:{"deviceId":deviceId,"dataType":actionType}
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
        "_id": {
            "deviceId":"$deviceId",
            "dataType":"$dataType"
        },
        "lastData": { $last: "$$ROOT" }
        }
    },
    {
        $project:{
            "_id":0,
            "lastData":{$slice:["$lastData.samples",-1]},
        }
    },
    {
        $project:{
            "lastData": {$arrayElemAt:["$lastData",0]}
        } 
    }
];
  return this.getAggregationData(pipeline);
}


static deleteMultipleDevicesData(ids){
  return this.deleteById(ids);
}
  // save() {
  //   const db = getDb();
  //   let dbOp;
  //   if (this._id) {
  //     // Update the deviceData data
  //     dbOp = db
  //       .collection('devices_data')
  //       .updateOne({ _id: this._id }, { $set: this });
  //   } else {
  //     dbOp = db
  //       .collection('devices_data')
  //       .insertOne(this);
  //   }
  //   return dbOp;
  // }
}

module.exports = DevicesData;
