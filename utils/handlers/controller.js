/**
 *
 * file - controller.js - The controller handler function
 *
 * @version    0.1.0
 * @created    10/11/2021
 * @copyright  Dhi Technologies
 * @license    For use by Dhi Technologies applications
 *
 * @description - Controller handler is the common handler used by all routes.
 *
 *
 * 10/11/2021 - PS - Created
 * 
**/

const controllerHandler = (promise, params) => async (req, res, next) => {
    const boundParams = params ? params(req, res, next) : []; //Checking if params were sent, if not setting to empty params
    try {
      const result = await promise(...boundParams);
      return res.json(result || { code: 200, message: 'OK' });
    } catch (error) {
      next(error);
    }
};

module.exports = controllerHandler;