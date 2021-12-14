/**
 *
 * file - service.js - The file that is used to handle socket service
 *
 * @author     Nikita Kriplani
 * @version    0.1.0
 * @created    25/11/2021
 * @copyright  Dhi Technologies
 * @license    For use by Dhi Technologies applications
 *
 * @description - All socket related services are handled in this file
 *
 * Unknown    - NK - Created
 * 13/12/2021 - PS - Updated
 * 
**/

/**
 * 
 * @class
 * @description - The socket service class is responsible for defining the services provided by socket to other modules
 * ,i.e the ability for other modules to send data to socket rooms
 * @todo none
 * 
 */
class SocketService {    
    constructor() {
        //TODO: Log with logger
        console.log('Socket service class Initialized');
    }

    setIO(io) {
        this.io = io;
    }
    
    sendDataToMultipleUsers(dataType, userIds, data, deviceId, groupId, categoryId) {
        console.log('Sending data now')
        switch (dataType) {

            case "elementDeletion":
            case "groupList":
                
                userIds.forEach((eachUserId, index) => {
                    this.io.to(dataType + ":" + eachUserId).emit(dataType, JSON.stringify(data))
                    if (index == userIds.length - 1) return true;        
                })
            break;

            case "groupScenes":
            case "groupAutomations":
            case "groupDevices":
            case "groupMembers":
            case "groupCategories":
                this.io.to(dataType + ":" + groupId).emit(dataType, JSON.stringify(data))
                return true;

            case "categorisedDevices":
                this.io.to(dataType + ":" + groupId + ":" + categoryId).emit(dataType, JSON.stringify(data));
                return true;

            case "deviceData":
            case "favouriteDevicesList":
                //TODO: Incorrect logic for favouriteDevicesList, needs to be discussed with NK
                this.io.to(dataType + ":" + deviceId).emit(dataType, JSON.stringify(data));
                return true;
        }
    }
}
    
module.exports = new SocketService();