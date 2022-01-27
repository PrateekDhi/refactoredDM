/**
 * Common class for execution of NoSQL queries
 */
const getDb = require('../../../utils/databases/mongo').getDb;

module.exports = class QueryExecutor {
    static #collection;
    constructor(collectionName) {
        this.db = getDb();
        QueryExecutor.#collection = db.collection(collectionName);
    }

    async save(obj) {
        let dbOp;
        try {
            if (obj.length != null) {
                dbOp = await QueryExecutor.#collection
                    .insertMany(obj);
            } else {
                dbOp = await QueryExecutor.#collection
                    .insertOne(obj);
            }
            return dbOp;
        } catch (error) {
            return error;
        }

    }


    static async findById(id) {
        try {
            if (id.length != null) {
                const result = await this.#collection
                    .find({ _id: { $in: id } })
                    .next();
                return result;
            } else {
                const result = await this.#collection
                    .find({ _id: id })
                    .next();
                return result;
            }
        } catch (error) {
            return error;
        }

    }

    static async findAndProjectDataById(ids, projectObj) {
        try {
            const result = await this.#collection
                .find({ _id: { $in: ids } })
                .project(projectObj)
                .toArray();
            return result;
        } catch (error) {
            return error;
        }

    }


    static async findAndProjectDataByOtherEntities(findObj, projectObj) {
        try {
            const result = await this.#collection
                .find(findObj)
                .project(projectObj)
                .toArray();
            return result;
        } catch (error) {
            return error;
        }

    }

    static async getCount(countObj) {
        try {
            const result = await this.#collection
                .countDocuments(countObj);
            return result;
        } catch (error) {
            return error;
        }
    }

    static async getAggregationData(pipeline) {
        try {
            const res = await this.#collection
                .aggregate(pipeline)
                .toArray();
            return res;
        } catch (error) {
            return error;
        }

    }

    static async deleteById(id) {
        let dbOp;
        try {
            if (id.length != null) {
                dbOp = await this.#collection
                    .deleteMany({ "_id": { $in: id } });
            } else {
                dbOp = await this.#collection
                    .deleteOne({ "_id": id });
            }
            return dbOp;
        } catch (error) {
            return error;
        }
    }


    static async deleteByOtherEntities(deleteQuery) {
        let dbOp;
        try {
            dbOp = await this.#collection
                .deleteMany(deleteQuery);
            return dbOp;
        } catch (error) {
            return error;
        }
    }

    async updateSingelDataSet(updateObj) {
        try {
            const result = await QueryExecutor.#collection
                .updateOne(updateObj[0], updateObj[1]);
            return result;
        } catch (error) {
            return error;
        }
    }

    static async updateMultipleDataSet(updateObj) {
        try {
            const result = await QueryExecutor.#collection
                .updateMany(updateObj[0], updateObj[1]);
            return result;
        } catch (error) {
            return error;
        }
    }

}