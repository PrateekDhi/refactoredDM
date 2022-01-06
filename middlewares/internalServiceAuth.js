const internalServiceAuth = require('../auth/InternalServices');

module.exports = (req, res, next) => {
    try{
        const result = internalServiceAuth(req.header('X-API-KEY'));
        if(!result.authSuccessful) return res.status(403).json({code:403,message:result.error,name:"forbidden"});
        res.locals.service = result.service;
        return next();
    } catch(err) {
        return next(err);
    }
}