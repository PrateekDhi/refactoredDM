const mongodb = require('mongodb');

const config = require('../../config');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
    MongoClient.connect(
        config.mongo_db.connection_string, {useNewUrlParser: config.mongo_db.use_new_url_parser_setting, useUnifiedTopology: config.mongo_use_unified_topology_setting}
    )
    .then(client => {
      _db = client.db();
      callback();
    })
    .catch(err => {
      throw err;
    });
};

const getDb = () => {
    if (_db) {
    return _db;
    }
    throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
