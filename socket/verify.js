/**
 *
 * file - verify.js - Socket token verification file
 *
 * @author     Nikita Kriplani
 * @version    0.1.0
 * @created    25/11/2021
 * @copyright  Dhi Technologies
 * @license    For use by Dhi Technologies applications
 *
 * @description - All socket token verification is done in this file
 *
 * Unknown    - NK - Created
 * 13/12/2021 - PS - Updated
 * 
**/
//Services
const socketIOService = require('../services/socketIO');

//Errors
const definedErrors = require('../errors');
const ApplicationError = definedErrors.ApplicationError;

module.exports = (socket, next) => {
    if (socket.handshake.headers['authorization'] && socket.handshake.headers['authorization'].split(" ")[0] === 'Bearer') {
        verifyToken(socket.handshake.headers['authorization'].split(" ")[1])
        .then(userId => {
            socket.handshake.userId = userId
            return next();
        })
        .catch(err => next(err));
    }else{
        //TODO: Create a new custom application errors for both
        if(!socket.handshake.headers['authorization']) next(new Error('No authorization header'));
        else next(new Error('Malformed authorization header'));
    }
}

//TODO:
const verifyToken = token => {
    return new Promise((resolve, reject) => {
        socketIOService.getTokenDataByTokenValue(token)
        .then(result => {
            if(!result.exists) throw new Error("No entries found for token");
            return resolve(result.userId)
        })
        .catch(error => {
            if(error instanceof ApplicationError) return reject(error);
            let caughtError;
            if(error.hasOwnProperty('sql')){
                caughtError = new definedErrors.DatabaseServerError();
                caughtError.setAdditionalDetails(`Query that failed - ${error.sql}, Error number - ${error.errno}, Error code - ${error.code}`);
                caughtError.setType('fatal');
                return reject(caughtError);
                // console.error('Query that failed - ', error.sql, 'Error number - ',error.errno, 'Error code - ',error.code);
                // error.message = "Database server error";
            }else if(error.message == 'No entries found for token'){
                caughtError = new definedErrors.IncorrectSocketIOToken();
                return reject(caughtError);
            }
            caughtError = new definedErrors.InternalServerError();
            caughtError.setAdditionalDetails(error);
            return reject(caughtError);
        });
    })
}