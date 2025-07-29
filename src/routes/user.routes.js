// src/routes/user.routes.js

const express = require('express');
const router = express.Router();

// Ensure both controller functions are imported
const { registerUser, loginUser } = require('../controllers/user.controller');

// This route handles registration
router.post('/', registerUser);

// This route handles login
router.post('/login', loginUser);

module.exports = router;