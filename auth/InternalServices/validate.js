exports.validateAPIKeyHeader = (apikeyHeader) => {
    if(apikeyHeader == null) return {valid: false, error: 'No api key header'};
    if(typeof(apikeyHeader) != 'string' || apikeyHeader.length === 0) return {valid: false, error: 'Malformed authorization header'};
    return {valid: true};
}