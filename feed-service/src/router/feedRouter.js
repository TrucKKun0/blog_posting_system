const express = require('express');
const router = express.Router();
const authRequest = require('../middlewares/authRequest');

router.get("/",authRequest,getFeed);