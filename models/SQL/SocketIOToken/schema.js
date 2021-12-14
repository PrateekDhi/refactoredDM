const Joi = require('joi');

module.exports = Joi.object({
    _id: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    expiresAt: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    userId: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
})