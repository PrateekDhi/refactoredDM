const definedRoles = require('./roles');

exports.validateRolesArray = (rolesArray) => {
    if(!Array.isArray(rolesArray)) return {valid: false, error: 'roles is not an array'};
    if(rolesArray.length === 0) return {valid: false, error: 'Empty roles array'};
    if(!rolesArray.every(element => {
        return Object.values(definedRoles).includes(element);
    })) return {valid: false, error: 'Invalid role in array'};
    return {valid: true};
}