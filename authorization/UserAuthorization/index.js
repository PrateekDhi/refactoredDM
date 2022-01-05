const groupService = require('../../services/group');

//Erros
const definedErrors = require('../../errors');
const ApplicationError = definedErrors.ApplicationError;

module.exports = (roles = []) => {
    //TODO: Add validation of roles sent
    return [
        // authorize based on user role
        (req, res, next) => {
            
            if (/*Something comes here*/true) {
                // user's role is not authorized
                const caughtError = definedErrors.Forbidden();
                caughtError.setAdditionalDetails("User trying to access resource he does not has access to, userId:", res.locals.userId);
                return next(caughtError);
            }

            // authorization successful, move on to next stage
            next();
        }
    ];
}