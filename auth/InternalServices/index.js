const cn = require('../../utils/common');
const validations = require('./validate');

//Errors
const definedErrors = require('../../errors');

module.exports = (apiKey) => {
    validationResult = validations.validateAPIKeyHeader(apiKey);
    if(!validationResult.valid){
        let caughtError;
        if(validationResult.error == "No api key header") {
            caughtError = new definedErrors.NoApiKeyHeader();
            caughtError.setAdditionalDetails("API Key Header -" + apiKey);
        } else if(validationResult.error == "Malformed api key header"){
            caughtError = new definedErrors.InvalidRequest();
            caughtError.setAdditionalDetails("API Key Header -" + apiKey);
        } else {
            caughtError = new definedErrors.InternalServerError();
            caughtError.setAdditionalDetails(validationResult.error);
        }
        throw caughtError;
    }
    if(apiKey === '1Ie007qXmLbFKe03sTJPyjfImquKJMPI'){ //testing, to be picked up from DB
        return {
            authSuccessful: true, 
            service: 'developer'
        };
    }else if(apiKey === 'GdPbd9lgwQBWRF6owmneJD9db4hPYZ4Z'){
        return {
            authSuccessful: true, 
            service: 'iam'
        };
    }else{
        return {
            authSuccessful: false, 
            error: "Incorrect API KEY"
        };
    } 
}