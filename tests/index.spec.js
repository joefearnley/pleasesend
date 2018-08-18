const baseUrl = `http://localhost:${process.env.PORT || 5000}`;
const request = require('supertest')(baseUrl);
const server = require('../server');

describe('GET /', () => {
  afterAll(() => {
    server.close();
  });

  test('It should return a 200', async () => {
      let response = await request.get('/');

      console.log(response);

      expect(response.status).toBe(200);
  });
});