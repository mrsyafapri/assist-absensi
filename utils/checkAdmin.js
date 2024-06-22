const axios = require('axios');
require("dotenv").config();

const checkAdminStatus = async (authToken) => {
    const perusahaanServicesUrls = process.env.PERUSAHAAN_SERVICES_URLS.split(',');

    for (const url of perusahaanServicesUrls) {
        try {
            const response = await axios.get(`${url}/api/v1/employee/profile`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });

            const employee = response.data.data;
            if (employee.isAdmin) {
                return true;
            }
        } catch (error) {
            console.error(`Error fetching from ${url}`);
        }
    }

    return false;
};

module.exports = { checkAdminStatus };
