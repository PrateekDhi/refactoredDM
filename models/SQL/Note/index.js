const db = require('../../../utils/databases/mysql');
const schema = require('./schema');

module.exports = class Note {
  constructor(_id, userId, groupId, body, creationTime, updationTime) {
    this._id = _id;
    this.userId = userId;
    this.groupId = groupId;
    this.body = body;
    this.creationTime = creationTime;
    this.updationTime = updationTime;
  }

  save() {
    const validationResult = schema.validate(this)
    if(validationResult.error) {
      throw new Error(validationResult.error)
    }
    return db.executeQuery(
      'INSERT INTO note(_id,userId,groupId,body,creationTime,updationTime) VALUES(?)',
      [[this.noteId, this.userId, this.groupId, this.body, Date.now(), Date.now()]]
    );
  }

  static deleteById(id) {}

  static findById(id) {
    return db.executeQuery('SELECT _id AS noteId, userId, body, groupId, creationTime, updationTime FROM note WHERE _id = ?', [id]);
  }
};
