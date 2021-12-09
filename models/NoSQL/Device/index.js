const mongodb = require('mongodb');
const getDb = require('../../../utils/databases/mongo').getDb;

class Device {
  constructor(_id, ownerId, groupId, categoryId, type, manufacturerName, primaryTopic, secondaryTopic, creationTime, updationTime, location, additionalDeviceDetails, controllable) {
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
  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      // Update the device
      dbOp = db
        .collection('devices')
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.collection('devices').insertOne(this);
    }
    return dbOp;
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection('devices')
      .find()
      .toArray()
    //   .then(devices => {
    //     return devices;
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
  }

  static findById(id) {
    const db = getDb();
    return db
      .collection('devices')
      .find({ _id: new mongodb.ObjectId(id) })
      .next()
    //   .then(device => {
    //     return device;
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
  }

  static deleteById(id) {
    const db = getDb();
    return db
      .collection('devices')
      .deleteOne({ _id: new mongodb.ObjectId(id) })
    //   .then(result => {
    //     console.log('Deleted');
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
  }
}

module.exports = Device;
