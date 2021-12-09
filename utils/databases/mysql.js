/**
 *
 * file - mysql.js - The file that is used handle mysql database connection
 *
 * @author     Prateek Shukla
 * @version    0.1.0
 * @created    10/11/2021
 * @copyright  Dhi Technologies
 * @license    For creating a mysql connection pool
 *
 * @description - All logging related functionalities are handled in this file
 * @returns {Promise} - Promise object represents pool of connection according to specifications provided
 * @throws Database server error
 * @todo none
 *
 * 10/11/2021 - PS - Created
 * 
**/

const config = require('../../config');
const mysql = require('mysql2');
let pool;
let db;

exports.initiateMySqlPool = () => {
    return new Promise((resolve, reject) => {
        pool = mysql.createPool({
            connectionLimit : config.mysql_db.connectionLimit || 100,
            host     : config.mysql_db.host || "localhost",
            user     : config.mysql_db.user || "root",
            password : config.mysql_db.password || "",
            database : config.mysql_db.database || "iam-v3",
            waitForConnections : config.mysql_db.waitForConnections || true,
            queueLimit : config.mysql_db.queueLimit || 1000
        });

        pool.getConnection((error, con) =>
        {
            if(error){
                return reject({"status":"failed", "error":`MySQL error. ${error}`});
            }
            try
            {
                if (con)
                {
                    con
                    .execute('SELECT 1', (err, results, fields) => {
                        con.release();
                        db = pool.promise();
                        if(err) return reject({"status":"failed", "error":`MySQL error. ${err}`});
                        return resolve({"status":"success", "message":"MySQL connected.", "con":"Connection done"});
                    })
                }
            }
            catch (err)
            {
                return reject({"status":"failed", "error":`MySQL error. ${err}`});
            }
        });
    });
}

exports.executeQuery = (query, params) => {
    if(db){
        if(params) return db.execute(query,params);
        return db.execute(query)
    }
}