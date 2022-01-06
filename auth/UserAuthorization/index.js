const validations = require('./validate');
const groupService = require('../../services/group');

//Erros
const definedErrors = require('../../errors');

module.exports = (roles, userId, groupId, sceneId, automationId) => {
    //Validating roles array sent for 
    validationResult = validations.validateRolesArray(roles);
    if(!validationResult.valid){
        const caughtError = new definedErrors.NoAuthorizationHeader();
        if(validationResult.error === "roles is not an array") caughtError.setAdditionalDetails("Invalid roles array(it is not an array) during user authorization, rolesArray value received :" + roles);
        else if(validationResult.error === "Empty roles array") caughtError.setAdditionalDetails("Empty roles array sent during user authorization");
        else if(validationResult.error === "Invalid role in array") caughtError.setAdditionalDetails("Invalid value inside roles array during user authorization, rolesArray value received: "+ roles);
        else caughtError.setAdditionalDetails(validationResult.error);
        throw caughtError;
    }

    //TODO: Add additional authorization logic for automation and scene users
    // authorize based on user role
    return groupService.getUserGroupRole(groupId, userId)
    .then(role => {
        if (!roles.includes(role)) {
            // If user does not have correct authorization in the group then the request fails
            // user's role is not authorized
            const caughtError = definedErrors.Forbidden();
            caughtError.setAdditionalDetails("User trying to access resource he does not has access to, userId:", userId);
            throw caughtError;
        }

        // authorization successful, move on to next stage
        return {
            authSuccessful: true, 
            role: role
        };
    })
    .catch(error => {
        const caughtError = definedErrors.InternalServerError();
        caughtError.setAdditionalDetails("Error during user authentication, Error - " + error);
        throw caughtError;
    })
}