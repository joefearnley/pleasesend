const baseUrl = `http://localhost:${process.env.PORT || 5000}`;
const request = require('supertest')(baseUrl);
const server = require('../server');

describe('GET /', () => {
  afterAll(() => {
    server.close();
  });

  test('It should return a 200', async () => {
      let response = await request.get('/');
      expect(response.status).toBe(200);
  });
});

