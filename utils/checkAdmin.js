const axios = require('axios');
require("dotenv").config();

const checkAdminStatus = async (authToken) => {
    const perusahaanServicesUrls = process.env.PERUSAHAAN_SERVICES_URLS.split(',');
    const axiosConfig = {
        headers: { Authorization: `Bearer ${authToken}` },
        timeout: 5000 // 5 seconds timeout
    };

    try {
        const requests = perusahaanServicesUrls.map(url =>
            axios.get(`${url}/api/v1/employee/profile`, axiosConfig)
        );
        const responses = await Promise.allSettled(requests);
        for (const response of responses) {
            if (response.status === 'fulfilled') {
                const employee = response.value.data.data;
                if (employee.isAdmin) {
                    return true;
                }
            } else {
                console.error(`Error fetching from ${response.reason.config.url}`);
            }
        }
    } catch (error) {
        console.error(`Unexpected error:`, error.message);
    }

    return false;
};

module.exports = checkAdminStatus;
