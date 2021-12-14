const db = require('../../../utils/databases/mysql');
const schema = require('./schema');

module.exports = class SocketIOToken {
  constructor(_id, expiresAt, userId) {
    this._id = _id;
    this.expiresAt = expiresAt;
    this.userId = userId;
  }

  save() {
    const validationResult = schema.validate(this)
    if(validationResult.error) {
      throw new Error(validationResult.error)
    }
    return db.executeQuery(
      'INSERT INTO socketio_token (_id, expiresAt, userId) VALUES (?, ?, ?)',
      [this._id, this.expiresAt, this.userId]
    );
  }

  static deleteById(id) {}

  static findById(id) {
    return db.executeQuery('SELECT * FROM socketio_token WHERE _id = ?', [id]);
  }
};
