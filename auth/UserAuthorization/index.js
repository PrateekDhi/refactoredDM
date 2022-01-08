const validations = require('./validate');
const groupService = require('../../services/group');

//Erros
const definedErrors = require('../../errors');
const ApplicationError = definedErrors.ApplicationError;

module.exports = (roles, userId, groupId, isSceneCreator, isAutomationCreator) => {
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
        let failureCondition;
        if(!isSceneCreator && !isAutomationCreator) failureCondition = !roles.includes(role);
        else if(isSceneCreator != null) failureCondition = !roles.includes(role) && isSceneCreator === false; //For scene related routes where creator of the scene has equal rights as owner of the group for this scene
        else failureCondition = !roles.includes(role) && isAutomationCreator === false; //For automation related routes where creator of the automation has equal rights as owner of the group for this automation
        if(failureCondition) {
            const caughtError = definedErrors.Forbidden();
            caughtError.setAdditionalDetails("User trying to access resource he does not has access to, userId:", userId);
            throw caughtError;
        }
        return {
            authSuccessful: true, 
            role: role
        };
    })
    .catch(error => {
        if(error instanceof ApplicationError) throw error;
        const caughtError = definedErrors.InternalServerError();
        caughtError.setAdditionalDetails("Error during user authentication, Error - " + error);
        throw caughtError;
    })
}