const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const userRoutes = require('./src/routes/user.routes');

const app = express();
const PORT = process.env.PORT || 5050;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the CodeCraftHub API! 🚀');
});
app.use('/api/users', userRoutes);

const startServer = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    await mongoose.connect(MONGODB_URI);
    console.log('Successfully connected to MongoDB!');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Could not connect to MongoDB:', error);
    process.exit(1);
  }
};

// Start server only if this file is run directly
if (require.main === module) {
  startServer();
}

// Export the app for testing
module.exports = app;