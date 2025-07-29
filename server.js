/**
 * Main server file for the CodeCraftHub API.
 * This file initializes the Express application, connects to MongoDB,
 * sets up middleware, and defines the API routes.
 */

// --- IMPORTS ---
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // Loads environment variables from a .env file

// Import Routers
const userRoutes = require('./src/routes/user.routes');
const courseRoutes = require('./src/routes/course.routes');

// --- INITIALIZATION ---
const app = express();
const PORT = process.env.PORT || 5050;

// --- MIDDLEWARE ---
// Enables the express app to parse JSON formatted request bodies
app.use(express.json());

// --- ROUTES ---
// A simple root route to confirm the API is running
app.get('/', (req, res) => {
  res.send('Welcome to the CodeCraftHub API! 🚀');
});

// Use the routers for specific API base paths
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);

/**
 * @desc Connects to the MongoDB database and starts the Express server.
 */
const startServer = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in the .env file.');
    }
    await mongoose.connect(MONGODB_URI);
    console.log('Successfully connected to MongoDB!');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Could not start server:', error);
    process.exit(1); // Exit the process with an error code
  }
};

// --- SERVER STARTUP ---
// This check ensures that the server only starts when this file is executed directly
// (e.g., with "node server.js"), and not when it's imported by another file (like our tests).
if (require.main === module) {
  startServer();
}

// Export the app for testing purposes
module.exports = app;