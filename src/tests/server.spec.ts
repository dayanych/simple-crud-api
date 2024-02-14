import request from 'supertest';
import { server } from '..';

describe('Simple CRUD Api server', () => {
  let userId: string;

  const mockName = 'John';
  const mockUserData = {
    username: mockName,
    age: 30,
    hobbies: ['football', 'basketball']
  };

  beforeAll(async () => {
    const response = await request(server).post('/api/users').send(mockUserData);
    userId = response.body.id;
  });

  afterAll((done) => {
    server.close(done);
  });

  describe('GET /users', () => {
    it('should return all users', async () => {
      const response = await request(server).get('/api/users');

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const response = await request(server)
        .post('/api/users')
        .send(mockUserData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });

    it('should not create if body is not valid', async () => {
      const response = await request(server)
        .post('/api/users')
        .send({
          notValidProperty: 'John',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /users/:id', () => {
    it('should return a user', async () => {
      const response = await request(server).get(`/api/users/${userId}`);

      expect(response.status).toBe(200);
      expect(response.body.username).toEqual(mockName);
    });

    it('should return 400 if user id is not valid', async () => {
      const response = await request(server).get('/api/users/123');

      expect(response.status).toBe(400);
    });
  });
});
