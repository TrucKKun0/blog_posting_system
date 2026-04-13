const User = require('../models/UserModel');
const logger = require('../utils/logger');

/**
 * Get user by ID
 */
const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        
        logger.info(`Fetching user with ID: ${userId}`);
        
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            logger.warn(`User not found with ID: ${userId}`);
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        logger.info(`User found: ${user.username}`);
        
        res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        logger.error(`Error fetching user: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user',
            error: error.message
        });
    }
};

/**
 * Get multiple users by IDs
 */
const getUsersByIds = async (req, res) => {
    try {
        const { userIds } = req.body;
        
        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'userIds array is required'
            });
        }
        
        logger.info(`Fetching ${userIds.length} users`);
        
        const users = await User.find({ _id: { $in: userIds } }).select('-password');
        
        logger.info(`Found ${users.length} users`);
        
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        logger.error(`Error fetching users: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            error: error.message
        });
    }
};

/**
 * Get all users
 */
const getAllUsers = async (req, res) => {
    try {
        logger.info('Fetching all users');
        
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        
        logger.info(`Found ${users.length} users`);
        
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        logger.error(`Error fetching all users: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            error: error.message
        });
    }
};

module.exports = {
    getUserById,
    getUsersByIds,
    getAllUsers
};
