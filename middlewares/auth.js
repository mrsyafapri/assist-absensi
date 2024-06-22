require('dotenv').config();
const jwt = require('jsonwebtoken');
const { responseError } = require('../utils/responseHandler');

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return responseError(res, 'Access denied! No token provided', 401);
    }
    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
        req.employee = decoded;
        next();
    } catch (err) {
        responseError(res, 'Invalid token', 403);
    }
};

module.exports = auth;
