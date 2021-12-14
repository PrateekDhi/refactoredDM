const mongodb = require('mongodb');
const getDb = require('../../../utils/databases/mongo').getDb;

class Automation {
  constructor(_id, groupId, eventType, triggerType, name, status, trigger, event, approvalStatus) {
    this._id = _id ? new mongodb.ObjectId(_id) : null;
    this.groupId = groupId;
    this.eventType = eventType;
    this.triggerType = triggerType;
    this.name = name;
    this.status = status;
    this.trigger = trigger;
    this.event = event;
    this.approvalStatus = approvalStatus;
  }

/**
 * 
 * @author Prateek Shukla
 * @description The function is used to create or update an automation, if _id is present in the instance then it will be updated 
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
      // Updating the automation
      dbOp = db
        .collection('automations')
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      // Inserting the automation
      dbOp = db
        .collection('automations')
        .insertOne(this);
    }
    return dbOp;
  }

  static findById(id) {
    const db = getDb();
    return db
      .collection('automations')
      .find({ _id: new mongodb.ObjectId(id) })
      .next()
  }

  static deleteById(id) {
    const db = getDb();
    return db
      .collection('automations')
      .deleteOne({ _id: new mongodb.ObjectId(id) })
  }
}

module.exports = Automation;
