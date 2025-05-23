const {validationResult} = require('express-validator');

/**
 * Export functions helper related to db, api calls...
 */
module.exports = {
    pick: (obj, keys) => {
        if (typeof keys === "string") keys = [keys];
        const result = {};
        keys.forEach(key => {
            if (typeof obj[key] !== "undefined") result[key] = obj[key];
        });

        return result;
    },

    validator: (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.jsonError(errors);
        return next();
    },
};

