const cn = require('../../utils/common');
const validations = require('./validate');

//Errors
const definedErrors = require('../../errors');
const ApplicationError = definedErrors.ApplicationError;

module.exports = (req,res,next) => {
    validationResult = validations.validateAPIKeyHeader(req.header('X-API-KEY'));
    if(!validationResult.valid){
        let caughtError;
        if(validationResult.error == "No api key header") {
            caughtError = new definedErrors.NoApiKeyHeader();
            caughtError.setAdditionalDetails("API Key Header -" + req.header('X-API-KEY'));
        } else if(validationResult.error == "Malformed api key header"){
            caughtError = new definedErrors.InvalidRequest();
            caughtError.setAdditionalDetails("API Key Header -" + req.header('X-API-KEY'));
        } else {
            caughtError = new definedErrors.InternalServerError();
            caughtError.setAdditionalDetails(validationResult.error);
        }
        return next(caughtError);
    }
    if(req.header('X-API-KEY') === '1Ie007qXmLbFKe03sTJPyjfImquKJMPI'){ //testing, to be picked up from DB
        res.locals.service = 'developer';
        next();
    }else if(req.header('X-API-KEY') === 'GdPbd9lgwQBWRF6owmneJD9db4hPYZ4Z'){
        res.locals.service = 'deviceManagement';
        next();
    }else{
        res
        .status(403)
        .json({code:403,message:"Invalid API KEY",name:"forbidden"});
    } 
}