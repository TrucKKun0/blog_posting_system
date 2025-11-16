const express = require('express');
const router = express.Router();
const {registerUser,loginUser,forgetPassword} = require('../controllers/user-controller');

router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/forget-password',forgetPassword);

module.exports = router;