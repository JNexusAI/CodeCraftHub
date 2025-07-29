/**
 * This module provides helper functions to manage an in-memory MongoDB server
 * for use in Jest test suites. This ensures that tests run in an isolated
 * environment without needing a running MongoDB instance.
 */
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

/**
 * @desc    Creates a new in-memory MongoDB server instance and connects Mongoose to it.
 * This should be called in a `beforeAll()` block in Jest.
 */
module.exports.connect = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
};

/**
 * @desc    Stops the in-memory server, drops the database, and closes the Mongoose connection.
 * This should be called in an `afterAll()` block in Jest.
 */
module.exports.closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await mongoServer.stop();
};

/**
 * @desc    Removes all data from all collections in the test database.
 * This should be called in an `afterEach()` block to ensure test isolation.
 */
module.exports.clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};