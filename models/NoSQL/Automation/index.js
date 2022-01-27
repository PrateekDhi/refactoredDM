const mongodb = require('mongodb');
// const getDb = require('../../../utils/databases/mongo').getDb;
// const ObjectID = require('mongodb').objectID;
// const db = getDb().collection('automations');
const DatabaseServerError = require('../../../errors/database_server_error');
const InvalidFields = require('../../../errors/invalid_fields');
const QueryExecutor = require('../NoSQLEntities/index')
class Automation extends QueryExecutor {
  constructor(_id, groupId, eventType, triggerType, name, status, trigger, event, approvalStatus) {
    super('automations');
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


  insertNewAutomationData(automationData) {
    if (this._id) {
      return this.updateSingelDataSet([{ _id: this._id }, { $set: this }]);
    } else {
      if (automationData == null) {
        return this.save(this);
      } else {
        return this.save(automationData);
      }
    }
  }


   static getAutomationDataById(id) {
      return this.findById(new mongodb.ObjectId(id));
  }

  static getGivenAutomationDataById(ids, fieldName) {
    const projectObj = {};
    projectObj[fieldName] = 1;
    return this.findAndProjectDataById(ids, projectObj);
  }


  // save() {
  //   // const db = getDb().collection('automations');
  //   let dbOp;
  //   if (this._id) {
  //     // Updating the automation
  //     dbOp = db
  //       .updateOne({ _id: this._id }, { $set: this });
  //   } else {
  //     // Inserting the automation
  //     dbOp = db
  //       .insertOne(this);
  //   }
  //   return dbOp;
  // }

  // static saveMany(automationData) {
  //   // const db = getDb().collection('automation');
  //   const insertedData = db.insertMany(automationData);
  //   return insertedData;
  // }

  // static findById(id) {
  //   // const db = getDb().collection('automations');
  //   return db
  //     .find({ _id: new mongodb.ObjectId(id) })
  //     .next()
  // }

  // static fetchFieldById(ids, fieldName) {
  //   const projectObj = {};
  //   projectObj[fieldName] = 1;
  //   db
  //     .find({ _id: { $in: ids } })
  //     .project(projectObj)
  //     .toArray()
  //     .then(res => {
  //       return res;
  //     }).catch(err => {
  //       throw new DatabaseServerError();
  //     })
  // }


  static getAutomationCountByGroupId(id, groupId) {
    let countObj = { _id: new mongodb.ObjectId(id), groupId: new mongodb.ObjectId(groupId) };
    return this.getCount(countObj)

  }

  static getCountByAutomatinType(id, automationType) {
    let countObj = { _id: new mongodb.ObjectId(id), "triggerType": automationType };
    return this.getCount(countObj);

  }

  static getGroupUsersAutomationsList(groupId, userId) {
    const pipeline = [
      {
        $match: { "groupId": new mongodb.ObjectId(groupId) }
      },
      {
        $addFields: {
          "status": { $slice: ["$status", -1] },
        }
      },
      {
        $addFields: {
          "status": { $arrayElemAt: ["$status", 0] },
        }
      },
      {
        $lookup:
        {
          from: 'automation_users',
          localField: '_id',
          foreignField: 'automationId',
          as: "automationUsersData"
        }
      },
      {
        $unwind: "$automationUsersData"
      },
      {
        $project: {
          "_id": 0,
          "automationId": "$_id",
          "automationName": "$name",
          "status": "$status",
          "userId": "$automationUsersData.userId"
        }
      },
      {
        $match: { "userId": new mongodb.ObjectId(userId) }
      },
      {
        $group: {
          "_id": "$automationId",
          "automationName": { $first: "$automationName" },
          "status": { $first: "$status" }
        }
      },
      {
        $project: {
          "automationId": "$_id",
          "automationName": 1,
          "status": 1
        }
      }
    ];
    return this.getAggregationData(pipeline);
  }

  static getGroupUsersAutomationsListV2(groupId, userId) {
    const pipeline = [
      {
        $match: { "groupId": new mongodb.ObjectId(groupId) }
      },
      {
        $addFields: {
          "status": { $slice: ["$status", -1] },
        }
      },
      {
        $addFields: {
          "status": { $arrayElemAt: ["$status", 0] },
        }
      },
      {
        $lookup:
        {
          from: 'automation_users',
          localField: '_id',
          foreignField: 'automationId',
          as: "automationUsersData"
        }
      },
      {
        $unwind: "$automationUsersData"
      },
      {
        $project: {
          "_id": 0,
          "automationId": "$_id",
          "automationName": "$name",
          "status": 1,
          "eventType": 1,
          "triggerType": 1,
          "creationTime": 1,
          "updationTime": 1,
          "groupId": 1,
          "approvalStatus": 1,
          "userId": "$automationUsersData.userId"
        }
      },
      {
        $match: { "userId": new mongodb.ObjectId(userId) }
      },
      {
        $group: {
          "_id": "$automationId",
          "automationName": { $first: "$automationName" },
          "status": { $first: "$status" },
          "eventType": { $first: "$eventType" },
          "triggerType": { $first: "$triggerType" },
          "creationTime": { $first: "$creationTime" },
          "updationTime": { $first: "$updationTime" },
          "groupId": { $first: "$groupId" },
          "approvalStatus": { $first: "$approvalStatus" },
        }
      },
      {
        $project: {
          "_id": 0,
          "automationId": "$_id",
          "automationName": 1,
          "status": 1,
          "eventType": 1,
          "triggerType": 1,
          "creationTime": 1,
          "updationTime": 1,
          "groupId": 1,
          "approvalStatus": 1,
        }
      }
    ];
    return this.getAggregationData(pipeline);
  }

  static getAutomaitonIdsBySceneIdViaAggregation(sceneIds, groupId) {
    const pipeline = [
      {
        $match:
        {
          "event.sceneId": { $in: sceneIds },
          "groupId": groupId
        }
      },
      {
        $project:
        {
          "automationId": "$_id",
          "_id": 0,
          "name": 1
        }
      }
    ];
    return this.getAggregationData(pipeline);
  }


  static getValidAutomationByDeviceId(ids) {
    const pipeline = [
      {
        $match: {
          "_id": {
            $in: ids
          }
        }
      },
      {
        $addFields: {
          count: 1
        }
      },
      {
        $group: {
          _id: "1",
          allGroups: {
            $push: "$groupId"
          },
          eventDevices: {
            $push: "$event.deviceId"

          },
          triggerDevice: {
            $push: "$trigger.triggerDeviceId"
          },
          allScenes: {
            $push: "$event.sceneId"
          },
          totalCount: {
            $sum: "$count"
          }
        }
      },
      {
        $project: {
          _id: 0,
          allGroups: {
            $setUnion: ["$allGroups"]
          },
          allDevices: {
            $setUnion: ["$eventDevices", "$triggerDevice"]
          },
          allScenes: {
            $setUnion: ["$allScenes"]
          },
          totalCount: 1
        }
      }
    ];
    return this.getAggregationData(pipeline);
  }

  static fetchAutomationData(id) {
    const pipeline = [
      {
        $match: { "_id": new mongodb.ObjectId(id) }
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
        $project: {
          "_id": 0,
          "automationId": "$_id",
          "automationName": "$name",
          "groupId": 1,
          "status": 1,
          "eventType": 1,
          "triggerType": 1,
          "trigger": 1,
          "event": 1,
          "creationTime": 1,
          "updationTime": 1,
          "approvalStatus": 1
        }
      }
    ];
    return this.getAggregationData(pipeline)
  }

  static fetchAutomationDataByGroupId(groupId) {
    const pipeline = [
      {
        $match: { "groupId": new mongodb.ObjectId(groupId) }
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
        $project: {
          "_id": 0,
          "automationId": "$_id",
          "automationName": "$name",
          "groupId": 1,
          "status": 1,
          "eventType": 1,
          "triggerType": 1,
          "triggers": 1,
          "events": 1,
          "creationTime": 1,
          "updationTime": 1,
          "approvalStatus": 1
        }
      }
    ];
    return this.getAggregationData(pipeline)
  }

  static deleteAutomationDataById(id) {
    return this.deleteById(id);

  }

  static updateAutomationData(ids, groupId, switchToGroupId) {
    let updateSet;
    if (groupId != null) {
      updateSet = [{ "groupId": new mongodb.ObjectId(groupId) }, { "groupId": switchToGroupId }];
    } else {
      updateSet = [{ _id: { $in: ids } }, { "groupId": switchToGroupId }];
    }
    return this.updateMultipleDataSet(updateSet);
  }

}

module.exports = Automation;
