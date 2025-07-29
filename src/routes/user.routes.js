// src/routes/user.routes.js

const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/user.controller');

// Defines the POST route for registering a user
router.post('/', registerUser);

module.exports = router;