const axios = require('axios');
require("dotenv").config();

const checkAdminStatus = async (authToken) => {
    const perusahaanServicesUrls = process.env.PERUSAHAAN_SERVICES_URLS.split(',');
    const requests = perusahaanServicesUrls.map(url => axios.get(`${url}/api/v1/employee/profile`, {
        headers: { Authorization: `Bearer ${authToken}` }
    }));

    try {
        const responses = await Promise.all(requests);
        for (const response of responses) {
            const employee = response.data.data;
            if (employee.isAdmin) {
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error('Error fetching admin status');
        return false;
    }
};

module.exports = checkAdminStatus;
