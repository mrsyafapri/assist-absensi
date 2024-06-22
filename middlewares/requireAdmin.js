require('dotenv').config();

const { checkAdminStatus } = require('../utils/checkAdmin');
const { responseError } = require('../utils/responseHandler');

const requireAdmin = async (req, res, next) => {
    const authToken = req.headers.authorization.split(' ')[1];

    try {
        const isAdmin = await checkAdminStatus(authToken);
        if (!isAdmin) {
            return responseError(res, 'Unauthorized: Only admins can perform this action', 403);
        }
        next();
    } catch (error) {
        responseError(res, 'Internal server error', 500);
    }
};

module.exports = requireAdmin;
