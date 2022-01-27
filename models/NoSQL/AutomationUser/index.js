const mongodb = require('mongodb');
const getDb = require('../../../utils/databases/mongo').getDb;
const QueryExecutor = require('../NoSQLEntities/index')
class AutomationUser extends QueryExecutor{
  constructor(_id, automationId, userId) {
    this._id = _id ? new mongodb.ObjectId(_id) : null;
    this.automationId = automationId;
    this.userId = userId;
  }

/**
 * 
 * @author Prateek Shukla
 * @description The function is used to create or update a automation user, if _id is present in the instance then it will be updated 
 * but if _id is not present in the instance it will be created
 * @param - none
 * @returns {Promise} - Unresolved Promise containing mongo query
 * @throws Database server error, Internal server error
 * @todo none
 * 
**/

insertMultipleDataIntoAutomationUsers(dataObj){
  return this.save(dataObj);
}

static deleteMultipleAutomationUsers(ids){
  return this.deleteById(ids);
}




  // save() {
  //   const db = getDb();
  //   let dbOp;
  //   if (this._id) {
  //     // Update the product
  //     dbOp = db
  //       .collection('automation_users')
  //       .updateOne({ _id: this._id }, { $set: this });
  //   } else {
  //     dbOp = db
  //       .collection('automation_users')
  //       .insertOne(this);
  //   }
  //   return dbOp
  // }

  // static fetchAll() {
  //   const db = getDb();
  //   return db
  //     .collection('automation_users')
  //     .find()
  //     .toArray()
  // }

  // static findById(prodId) {
  //   const db = getDb();
  //   return db
  //     .collection('automation_users')
  //     .find({ _id: new mongodb.ObjectId(prodId) })
  //     .next()
  // }

  // static deleteById(prodId) {
  //   const db = getDb();
  //   return db
  //     .collection('automation_users')
  //     .deleteOne({ _id: new mongodb.ObjectId(prodId) })
  // }
}

module.exports = AutomationUser;
