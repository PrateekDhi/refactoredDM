exports.validateAuthorizationHeader = (authorizationHeader) => {
    if(authorizationHeader == null || authorizationHeader.length === 0) return {valid: false, error: 'No authorization header'};
    if(authorizationHeader.split(" ")[0] !== 'Bearer' || authorizationHeader.length <= 6) return {valid: false, error: 'Malformed authorization header'};
    return {valid: true};
}