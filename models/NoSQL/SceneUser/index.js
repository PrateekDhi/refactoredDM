const mongodb = require('mongodb');
const QueryExecutor = require('../NoSQLEntities/index');

class SceneUser extends QueryExecutor {
    constructor(_id, SceneId, userId) {
        this._id = _id ? new mongodb.ObjectId(_id) : null;
        this.SceneId = SceneId;
        this.userId = userId;
    }

    /**
     * 
     * @author Prateek Shukla
     * @description The function is used to create or update a Scene user, if _id is present in the instance then it will be updated 
     * but if _id is not present in the instance it will be created
     * @param - none
     * @returns {Promise} - Unresolved Promise containing mongo query
     * @throws Database server error, Internal server error
     * @todo none
     * 
    **/

    insertMultipleDataIntoSceneUsers(dataObj) {
        return this.save(dataObj);
    }

    static deleteMultipleSceneUsers(sceneId) {
        let deleteQuery = {"sceneId": sceneId}
        return this.deleteByEntityName(deleteQuery);
    }

    static countSceneMemership(sceneId, userId){
        let countObj = { "sceneId": sceneId, "userId": userId };
        return this.getCount(countObj);
    }

    static updateSceneUsersData(sceneIds, userId) {
        let updateSet;
          updateSet = [{ "sceneId": { $in: { sceneIds } } }, { $set: { "userId": userId } }];
        return this.updateMultipleDataSet(updateSet);
      }
}

module.exports = SceneUser