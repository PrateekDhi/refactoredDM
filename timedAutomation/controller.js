/**
 *
 * file - controller.js - The controller for timed automations handling
 *
 * @author     Prateek Shukla
 * @version    0.1.0
 * @created    10/11/2021
 * @copyright  Dhi Technologies
 * @license    For use by Dhi Technologies applications
 *
 * @description - Controller handler is the primary file for the timed automation handling module. 
 * The cron job for timed automation handling is initialized using this file
 *
 * 14/01/2022 - PS - Created
 * 
**/

//Dependencies
//TODO: Optimization - Try to use cron npm package instead of node-cron for this
const cron = require("node-cron");

//Services
const automationService = require('../services/automation');
const deviceService = require('../services/device');

//Errors
const definedErrors = require('../errors');
const ApplicationError = definedErrors.ApplicationError;
const errorHandler = require('../utils/handlers/error');

module.exports = () => {
    cron.schedule("0,30 * * * * *", function() {    //This cron jobs runs every 30 seconds
        console.log('Timed automation handler running every 30 seconds')
        Promise.allSettled([
            automationService.getRunnableTimeAndDeviceBasedAutomations(),
            automationService.getRunnableTimeAndSceneBasedAutomations()
        ])
        .then(results => {
            console.log(results);
            let automations = [];
            for(let result of results){
                if(result.status === 'fulfilled' || result.value.length > 0) automations.push(result.value);
                else if(result.status !== 'fulfilled'){
                    if(error instanceof ApplicationError) errorHandler.handleError(error);
                    const caughtError = new definedErrors.InternalServerError();
                    caughtError.setMessage("Internal server error on timed automations runner, while fetching runnable automations");
                    caughtError.setAdditionalDetails(error);
                    errorHandler.handleError(caughtError);
                }
            }
            if(automations.length > 0){
                return deviceService.mergeConcurrentActionsByEventDeviceType(automations)
            }
        })
        .then(correctedAutomations => deviceService.runAutomationDevicesInParallel(correctedAutomations))
        .catch(error => {
            console.log(error)
            if(error instanceof ApplicationError) errorHandler.handleError(error);
            const caughtError = new definedErrors.InternalServerError();
            caughtError.setMessage("Internal server error on timed automations runner");
            caughtError.setAdditionalDetails(error);
            return errorHandler.handleError(caughtError);
        })
    })
}