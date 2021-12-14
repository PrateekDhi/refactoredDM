// const validationMiddleware = require('../middlewares/validationMiddleware');
const c = require('../utils/handlers/controller');
const {socketService} = require('../socket');

//Services


//Response model
const Response = require('../utils/response');

//Errors
const definedErrors = require('../errors');
const ApplicationError = definedErrors.ApplicationError;

module.exports = (router, app) => {
    router.post('/testSocket',(req,res,next) => {
        
    })
    return router
}