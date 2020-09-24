const jwt = require('jsonwebtoken');
const config = require('config');
const string = require('../src/constants/string');

module.exports = function (req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if not taken 
    if (!token) {
        return res.status(401).json({
            msg: string.auth.noTokenAuth
        });
    }

    //Verify token 
    try {
        const decoded = jwt.verify(token, config.get("jwtSecret"));
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({
            msg: string.auth.tokenNotValid
        });
    }
};