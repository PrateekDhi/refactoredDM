/**
 * Common class for execution of NoSQL queries
 */
const getDb = require('../../../utils/databases/mongo').getDb;

module.exports = class QueryExecutor {
    #collection;
    constructor(collectionName) {
        this.db = getDb();
        this.#collection = db.collection(collectionName);
    }

    async save(obj) {
        let dbOp;
        try {
            if (obj.length != null) {
                dbOp = await this.#collection
                    .insertMany(obj);
            } else {
                dbOp = await this.#collection
                    .insertOne(obj);
            }
            return dbOp;
        } catch (error) {
            return error;
        }

    }


    async findById(id) {
        try {
            const result = await this.#collection
                .find({ _id: id })
                .next();
            return result;
        } catch (error) {
            return error;
        }

    }

    async findAndProjectDataById(ids, projectObj) {
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

    async getCount(countObj) {
        try {
            const result = await this.#collection
                .countDocuments(countObj);
            return result;
        } catch (error) {
            return error;
        }
    }

    async getAggregationData(pipeline) {
        try {
            const res = await this.#collection
                .aggregate(pipeline)
                .toArray();
            return res;
        } catch (error) {
            return error;
        }

    }

    async deleteById(id) {
        let dbOp;
        try {
            if (id.length != null) {
                dbOp = await this.#collection
                    .deleteMany(id);
            } else {
                dbOp = await this.#collection
                    .deleteOne(id);
            }
            return dbOp;
        } catch (error) {
            return error;
        }

    }
    
    async updateSingelDataSet(updateObj){
        try {
            const result = await this.#collection
            .updateOne(updateObj);
            return result;
        } catch (error) {
            return error;
        }
    }

    async updateMultipleDataSet(updateObj){
        try {
            const result = await this.#collection
            .updateMany(updateObj[0], updateObj[1]);
            return result;
        } catch (error) {
            return error;
        }
    }

}