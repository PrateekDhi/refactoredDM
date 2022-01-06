const userAuthentication = require('../auth/UserAuthentication');

module.exports = (req, res, next) => {
    try {
        const result = userAuthentication(req.header('Authorization'));
        if(!result.authSuccessful) 
        return res.status(result.internalServiceResponse.statusCode).json({ 
            code: result.internalServiceResponse.code,
            message: result.internalServiceResponse.message,
            name: result.internalServiceResponse.name
        });
        res.locals.userId = result.userId;
        return next();
    } catch(err) {
        return next(err);
    }
}