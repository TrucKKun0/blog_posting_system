const express = require('express');
const router = express.Router();
const {registerUser,loginUser,forgetPassword,logoutUser} = require('../controllers/auth-controller');
const {generateNewAccessToken} = require('../controllers/auth-controller');

router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/forget-password',forgetPassword);
router.post('/refresh-access-token',generateNewAccessToken);
router.post('/logout',logoutUser);

module.exports = router;