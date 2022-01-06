const cn = require('../../utils/common');
const validations = require('./validate');
const internalHttpsRequestHelper = require('../../utils/helpers/internalHttpsRequest');

//Errors
const definedErrors = require('../../errors');
const ApplicationError = definedErrors.ApplicationError;

module.exports = (authorizationHeader) => {
    validationResult = validations.validateAuthorizationHeader(authorizationHeader);
    if(!validationResult.valid){
        let caughtError;
        if(validationResult.error == "No authorization header") {
            caughtError = new definedErrors.NoAuthorizationHeader();
            caughtError.setAdditionalDetails("Authorization Header -" + authorizationHeader);
        } else if(validationResult.error == "Malformed authorization header"){
            caughtError = new definedErrors.InvalidRequest();
            caughtError.setAdditionalDetails("Authorization Header -" + authorizationHeader);
        } else {
            caughtError = new definedErrors.InternalServerError();
            caughtError.setAdditionalDetails(validationResult.error);
        }
        throw caughtError;
    }

    internalHttpsRequestHelper('iam', '/internal/validateUserToken', 'POST', {'Authorization': 'Bearer '+ authorizationHeader.split(" ")[1]}, null)
    .then(data => {
        if(data.code === 200){
            // res.locals.userId = data.data.userId;
            return {
                authSuccessful: true, 
                userId: data.data.userId
            };
        }else{
            if(data.code && data.message && data.name && data.statusCode) 
            return {
                authSuccessful: false, 
                internalServiceResponse: {
                    code: data.code, 
                    message: data.message, 
                    name: data.name, 
                    statusCode: data.statusCode
                }
            };
            const caughtError = new definedErrors.InternalServerError();
            caughtError.setAdditionalDetails("Internal request for validating user token failed, response data - " + data);
            throw caughtError;
        }
    })
    .catch(error => {
        if(error instanceof ApplicationError) throw error;
        const caughtError = new definedErrors.InternalServerError();
        caughtError.setAdditionalDetails(error);
        throw caughtError;
    })
}