const cn = require('../utils/common');
const Group = require('../models/SQL/Group');

const definedErrors = require('../errors');
const ApplicationError = definedErrors.ApplicationError;

/**
 * 
 * @author Prateek Shukla
 * @description The function is used to get a user's role in a given group
 * @param {string} username - User's username
 * @returns {Promise} - Promise object represents either javascript object {present: false} if entity is not present or 
 * javascript object {present: true, data: <Data that was requested from this function>} if entity is present
 * @throws Database server error, Internal server error
 * @todo none
 * 
**/
exports.getUserGroupRole = (username) => {
    return new Promise((resolve, reject) => {
        User.findEmailByUsername(username)
        .then(([rows,fields]) => {
            let returnValue = {};
            if(rows.length == 1){
                returnValue.present = true;
                returnValue.data = rows[0];
                return resolve(returnValue);
            }else if(rows.length == 0){
                returnValue.present = false;
                return resolve(returnValue);
            }
            throw new Error("Duplicate entries found for given username - " + username)
            // return reject("Duplicate entries found for given username - " + username);
        })
        .catch(error => {
            if(error instanceof ApplicationError) return reject(error);
            if(error.hasOwnProperty('sql')){
                const caughtError = new definedErrors.DatabaseServerError();
                caughtError.setAdditionalDetails(cn.getSqlErrorStringFromError(error));
                caughtError.setType('fatal');
                return reject(caughtError);
            //   console.error('Query that failed - ', error.sql, 'Error number - ',error.errno, 'Error code - ',error.code);
            //   error.message = "Database server error";
            }
            const caughtError = new definedErrors.InternalServerError();
            caughtError.setAdditionalDetails(error);
            return reject(caughtError);
            // return reject(error);
        });
    })
}