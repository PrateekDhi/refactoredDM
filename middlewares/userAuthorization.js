const userAuthorization = require('../auth/UserAuthorization');

//Errors
const definedErros = require('../errors');

module.exports = (roles, additionalAuthorization) => {
    return [
        (req, res, next) => {
            try {
                if(!res.locals.userId) {
                    let caughtError = definedErros.InternalServerError();
                    caughtError.setAdditionalDetails("No userId provided for authorization in user authorization middleware");
                    return next(caughtError);
                }
                if(!res.locals.groupId) {
                    let caughtError = definedErros.InternalServerError();
                    caughtError.setAdditionalDetails("No groupId provided for authorization in user authorization middleware");
                    return next(caughtError);
                }
                let result;
                if(additionalAuthorization === 'automationAuth') {
                    if(!res.locals.automationId) {
                        let caughtError = definedErros.InternalServerError();
                        caughtError.setAdditionalDetails("No automationId provided for authorization in user authorization middleware");
                        return next(caughtError);
                    }
                    result = userAuthorization(roles, res.locals.userId, res.locals.groupId, null, res.locals.automationId)
                }
                else if(additionalAuthorization === 'sceneAuth') { 
                    if(!res.locals.sceneId) {
                        let caughtError = definedErros.InternalServerError();
                        caughtError.setAdditionalDetails("No sceneId provided for authorization in user authorization middleware");
                        return next(caughtError);
                    }
                    result = userAuthorization(roles, res.locals.userId, res.locals.groupId, res.locals.sceneId, null)
                }
                else result = userAuthorization(roles, userId, groupId);
                if(!result.authSuccessful) 
                return res.status(403).json({code:403,message:result.error,name:"forbidden"});  //This can be changed to work with error handling middleware instead
                res.locals.userRole = result.role;
                return next();
            } catch(err) {
                next(err);
            }
        }
    ];
}