const axios = require('axios');
const logger = require('./logger');

const IDENTITY_SERVICE_URL = process.env.IDENTITY_SERVICE_URL || 'http://localhost:3001';

/**
 * Fetch user by ID from identity service
 */
const fetchUserById = async (userId) => {
    try {
        const response = await axios.get(`${IDENTITY_SERVICE_URL}/api/auth/user/${userId}`);
        if (response.data && response.data.success) {
            logger.info(response.data.data);
            return response.data.data;
        }
        return null;
    } catch (error) {
        logger.error(`Error fetching user ${userId}: ${error.message}`);
        return null;
    }
};

/**
 * Fetch multiple users by IDs from identity service
 */
const fetchUsersByIds = async (userIds) => {
    try {
        const response = await axios.post(`${IDENTITY_SERVICE_URL}/api/auth/users/batch`, {
            userIds
        });
        if (response.data && response.data.success) {
            return response.data.data;
        }
        return [];
    } catch (error) {
        logger.error(`Error fetching users: ${error.message}`);
        return [];
    }
};

/**
 * Fetch username by ID from identity service (lightweight)
 */
const fetchUsernameById = async (userId) => {
    try {
        const response = await axios.get(`${IDENTITY_SERVICE_URL}/api/auth/user/${userId}`);
        if (response.data && response.data.success) {
            return response.data.data.username;
        }
        return null;
    } catch (error) {
        logger.error(`Error fetching username for ${userId}: ${error.message}`);
        return null;
    }
};

module.exports = {
    fetchUserById,
    fetchUsersByIds,
    fetchUsernameById
};
