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