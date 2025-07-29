const supertest = require('supertest');
const app = require('../../server'); // Our app export
const db = require('../config/test-db');

const request = supertest(app);

// Connect to the test database before all tests
beforeAll(async () => await db.connect());

// Clear the test database after each test
afterEach(async () => await db.clearDatabase());

// Close the test database after all tests
afterAll(async () => await db.closeDatabase());

/**
 * Test suite for User Registration
 */
describe('User Registration: POST /api/users', () => {
  it('should create a new user successfully', async () => {
    const response = await request
      .post('/api/users')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('username', 'testuser');
    expect(response.body).not.toHaveProperty('password');
  });

  it('should fail if email is already taken', async () => {
    // First, create a user
    await request.post('/api/users').send({
      username: 'testuser1',
      email: 'taken@example.com',
      password: 'password123',
    });

    // Then, try to create another user with the same email
    const response = await request
      .post('/api/users')
      .send({
        username: 'testuser2',
        email: 'taken@example.com',
        password: 'password456',
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'User already exists');
  });

  it('should fail if password is missing', async () => {
    const response = await request
      .post('/api/users')
      .send({
        username: 'testuser',
        email: 'test@example.com',
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Please enter all fields');
  });
});


/**
 * Test suite for User Login
 */
describe('User Login: POST /api/users/login', () => {
  it('should log in a user successfully with correct credentials', async () => {
    // First, create a user to log in with
    await request.post('/api/users').send({
      username: 'loginuser',
      email: 'login@example.com',
      password: 'password123',
    });

    // Attempt to log in
    const response = await request
      .post('/api/users/login')
      .send({
        email: 'login@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should fail to log in with an incorrect password', async () => {
    // First, create a user
    await request.post('/api/users').send({
      username: 'loginuser',
      email: 'login@example.com',
      password: 'password123',
    });

    // Attempt to log in with wrong password
    const response = await request
      .post('/api/users/login')
      .send({
        email: 'login@example.com',
        password: 'wrongpassword',
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Invalid email or password');
  });

  it('should fail to log in with a non-existent email', async () => {
    const response = await request
      .post('/api/users/login')
      .send({
        email: 'nosuchuser@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Invalid email or password');
  });
});