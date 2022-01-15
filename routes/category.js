// const validationMiddleware = require('../middlewares/validationMiddleware');
const c = require('../utils/handlers/controller');

//Middlewares
const checkTokenAuthentication = require('../auth/UserAuthentication');
const authorize = require('../middlewares/userAuthorization');
const validationMiddleware = require('../middlewares/requestValidation');
const stringifiedObjectParser = require('../middlewares/stringifiedObjectParser');
const groupEntityValidation = require('../middlewares/groupEntityValidation');
const automationRole = require('../middlewares/automationRole');

//Controllers
const categoryController = require('../controllers/category');

//Response model
const Response = require('../utils/response');

//Errors
const definedErrors = require('../errors');
const ApplicationError = definedErrors.ApplicationError;

module.exports = (router, app) => {
    // router.post('/fetchGroupCategories',
    // validationMiddleware,
    // checkTokenAuthorization,
    // groupEntityValidation,
    // authorize([Roles.Owner, Roles.Member]),
    // c(categoryController.fetchGroupCategories, (req, res, next) => []));

    // router.post('/createCategory',
    // validationMiddleware, 
    // checkTokenAuthorization,
    // c(categoryController.createCategory, (req, res, next) => []));

    // router.post('/createCategories',checkTokenAuthorization,requestBodyArrayParsing,validationMiddleware,c(categoryController.createCategories, (req, res, next) => []));
    // router.post('/updateCategory',checkTokenAuthorization,requestBodyArrayParsing,validationMiddleware,c(categoryController.updateCategory, (req, res, next) => []));
    // router.post('/updateCategories',checkTokenAuthorization,requestBodyArrayParsing,validationMiddleware,c(categoryController.updateCategories, (req, res, next) => []));
    // router.post('/deleteCategory',checkTokenAuthorization,validationMiddleware,c(categoryController.deleteCategory, (req, res, next) => []));

    return router
}