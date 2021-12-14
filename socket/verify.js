const SocketIOToken = require('../models/SQL/SocketIOToken');
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
        SocketIOToken.findById(token)
        .then(([rows,fields]) => {
            if(rows.length == 1) return resolve(rows[0].userId);
            else if(rows.length == 0) throw new Error("No entries found for token");
            throw new Error("Duplicate entries found for given token");
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