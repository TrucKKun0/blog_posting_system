const authRequest = require('../middleware/authRequest');
const {searchPosts} = require('../controller/searchController');
const express = require('express');
const router = express.Router();

router.get('/', authRequest.authRequest, searchPosts);