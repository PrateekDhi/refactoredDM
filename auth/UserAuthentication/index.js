const cn = require('../../utils/common');
const validations = require('./validate');
const internalHttpsRequestHelper = require('../../utils/helpers/internalHttpsRequest');

//Errors
const definedErrors = require('../../errors');
const ApplicationError = definedErrors.ApplicationError;

module.exports = (req, res, next) => {
    validationResult = validations.validateAuthorizationHeader(req.header('Authorization'));
    if(!validationResult.valid){
        let caughtError;
        if(validationResult.error == "No authorization header") {
            caughtError = new definedErrors.NoAuthorizationHeader();
            caughtError.setAdditionalDetails("Authorization Header -" + req.header('Authorization'));
        } else if(validationResult.error == "Malformed authorization header"){
            caughtError = new definedErrors.InvalidRequest();
            caughtError.setAdditionalDetails("Authorization Header -" + req.header('Authorization'));
        } else {
            caughtError = new definedErrors.InternalServerError();
            caughtError.setAdditionalDetails(validationResult.error);
        }
        return next(caughtError);
    }

    internalHttpsRequestHelper('iam', '/internal/validateUserToken', 'POST', {'Authorization': 'Bearer '+ req.header('Authorization').split(" ")[1]}, null)
    .then(data => {
        if(data.code === 200){
            res.locals.userId = data.data.userId;
            return next();
        }else{
            if(data.code && data.message && data.name && data.statusCode) 
                return res.status(data.statusCode).json({ code: data.code, message: data.message,  name: data.name});
            const caughtError = new definedErrors.InternalServerError();
            caughtError.setAdditionalDetails("Internal request for validating user token failed, response data - " + data);
            return next(caughtError);
        }
    })
    .catch(error => {
        if(error instanceof ApplicationError) return next(error);
        const caughtError = new definedErrors.InternalServerError();
        caughtError.setAdditionalDetails(error);
        return next(caughtError);
    })
}