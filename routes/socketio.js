// const validationMiddleware = require('../middlewares/validationMiddleware');
const c = require('../utils/handlers/controller');
// const {socketService} = require('../socket'); //FOR SOCKET CONNECTION TESTING

//Services


//Response model
const Response = require('../utils/response');

//Errors
const definedErrors = require('../errors');
const ApplicationError = definedErrors.ApplicationError;

module.exports = (router, app) => {
    // router.post('/testSocket',(req,res,next) => {
    //     socketService.sendDataToMultipleUsers('groupList', ['abcd1234'], [{"groupId":"dawfafafa","groupName":"afbsnvabhg"},{"groupId":"vkcvbvb","groupName":"dkjjsfhgjasfh"}], null, null, null);
    //     res.status(200).json({"message":"OK"})
    // })     //FOR SOCKET CONNECTION TESTING
    // router.post('/getSocketIOConnectionToken', checkTokenAuthorization, restrictedController.getSocketIOConnectionToken);

    return router
}