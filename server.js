// Import Dependencies
const express = require('express');
require('dotenv').config();

// Create Express App
const app = express();
const PORT = process.env.PORT || 3000;

// Define a simple root route for testing
app.get('/', (req, res) => {
  res.send('Welcome to the CodeCraftHub API! 🚀');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});