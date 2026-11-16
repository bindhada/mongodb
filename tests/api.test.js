
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../index.js';

describe('Library API', () => {
  describe('Unknown routes', () => {
    it('returns 404 for an unknown route', async () => {
      const response = await request(app).get('/unknown-route');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Route not found');
    });
  });

  describe('POST /books', () => {
    it('rejects a book with invalid data', async () => {
      const response = await request(app)
        .post('/books')
        .send({
          title: '',
          genre: '',
          published_year: 'not-a-number'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid book data');
    });

    it('rejects a book with missing required fields', async () => {
      const response = await request(app)
        .post('/books')
        .send({
          title: 'The Hobbit'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid book data');
    });

    it('rejects a book with a negative author ID', async () => {
      const response = await request(app)
        .post('/books')
        .send({
          title: 'The Hobbit',
          genre: 'Fantasy',
          published_year: 1937,
          author_id: -1
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid book data');
    });
  });

  describe('GET /books', () => {
    it('rejects an invalid page number', async () => {
      const response = await request(app)
        .get('/books?page=0');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid page or limit');
    });

    it('rejects a limit greater than 100', async () => {
      const response = await request(app)
        .get('/books?limit=101');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid page or limit');
    });

    it('rejects an invalid sorting field', async () => {
      const response = await request(app)
        .get('/books?sort=password');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid sort field');
    });
  });
});
