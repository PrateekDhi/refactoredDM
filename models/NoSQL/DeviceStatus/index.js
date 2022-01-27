const mongodb = require('mongodb');
const getDb = require('../../../utils/databases/mongo').getDb;

const QueryExecutor = require('../NoSQLEntities');
class DevicesStatus extends QueryExecutor{
  constructor(_id, day, deviceId, hour, first, last, status) {
    this._id = _id ? new mongodb.ObjectId(_id) : null;
    this.day = day;
    this.deviceId = deviceId;
    this.hour = hour;
    this.first = first;
    this.last = last;
    this.status = status;
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


insertNewDevicesStatusData() {
  if (this._id) {
    return this.updateSingelDataSet([{ _id: this._id }, { $set: this }]);
  } else {
    return this.save(this);
  }
}
}

module.exports = DevicesStatus;
