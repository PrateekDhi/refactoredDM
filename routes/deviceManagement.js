// const validationMiddleware = require('../middlewares/validationMiddleware');
const c = require('../utils/handlers/controller');

//Services


//Response model
const Response = require('../utils/response');

//Errors
const definedErrors = require('../errors');
const ApplicationError = definedErrors.ApplicationError;

module.exports = (router, app) => {
    // router.post('/deviceFilterationByMacAddress',checkTokenAuthorization, requestBodyArrayParsing,validationMiddleware,restrictedController.deviceFilterationByMacAddress);
    // router.post('/validateDeviceOnboarding',checkTokenAuthorization,validationMiddleware, restrictedController.validateDeviceOnboarding);
    // router.post('/qrCodeOnboarding',checkTokenAuthorization, requestBodyArrayParsing, validationMiddleware, restrictedController.qrCodeOnboarding);
    // router.post('/fetchDeviceManufacturersList',checkTokenAuthorization, restrictedController.fetchDeviceManufacturersList);
    // router.post('/manualOnboarding',checkTokenAuthorization, requestBodyArrayParsing, validationMiddleware, restrictedController.manualOnboarding);
    // router.post('/checkDeviceActivation',checkTokenAuthorization,validationMiddleware, restrictedController.checkDeviceActivation);
    // router.post('/addNewDevice',checkTokenAuthorization,validationMiddleware,restrictedController.addNewDevice);
    // router.post('/controlDevice',checkTokenAuthorization,validationMiddleware,restrictedController.controlDevice);

    // router.post('/transferDevice',checkTokenAuthorization,validationMiddleware,restrictedController.transferDevice);
    // router.post('/transferDeviceToCategory',checkTokenAuthorization,validationMiddleware,restrictedController.transferDeviceToCategory);

    // router.post('/manageFavouriteDevice',checkTokenAuthorization,validationMiddleware,restrictedController.manageFavouriteDevice);

    // router.post('/fetchGroupDevices',checkTokenAuthorization,validationMiddleware,restrictedController.fetchGroupDevices);
    // router.post('/fetchDeviceById',checkTokenAuthorization,restrictedController.fetchDeviceById);
    // router.post('/fetchUserFavouriteDevices',checkTokenAuthorization,restrictedController.fetchUserFavouriteDevices);
    // router.post('/fetchPowerGraphForGroup',checkTokenAuthorization,validationMiddleware,restrictedController.fetchPowerGraphForGroup);
    // router.post('/fetchPowerGraphForCategory',checkTokenAuthorization,restrictedController.fetchPowerGraphForCategory);
    // // router.post('/removeDevice',checkTokenAuthorization,restrictedController.removeDevice);
    // // router.post('/editDeviceDetails',checkTokenAuthorization,restrictedController.editDeviceDetails)
    // // router.post('/editFeatureDetails',checkTokenAuthorization,restrictedController.editFeatureDetails)
    // // router.post('/editDeviceAndFeatureDetails', checkTokenAuthorization, restrictedController.editDeviceAndFeatureDetai
    // // router.post('/transferDeviceOwnership',checkTokenAuthorization,restrictedController.transferDeviceOwnership);
    // // router.post('/transferDeviceToNewGroup',checkTokenAuthorization,restrictedController.transferDeviceToNewGroup);

    // router.post('/addTestDevices', restrictedController.addTestDevices);  //TESTING METHOD
    return router
}