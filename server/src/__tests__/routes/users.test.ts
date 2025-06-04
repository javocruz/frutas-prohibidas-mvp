import request from 'supertest';
import express from 'express';
import { mockUsers } from '../setup';
import usersRouter from '../../routes/users';
import { ApiError } from '../../utils/ApiError';

describe('Users Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/users', usersRouter);
  });

  describe('GET /api/users', () => {
    it('should return all users', async () => {
      const response = await request(app).get('/api/users');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: mockUsers,
      });
    });
  });

  describe('POST /api/users/:id/points', () => {
    it('should update user points successfully', async () => {
      const userId = '1';
      const newPoints = 150;

      const response = await request(app)
        .post(`/api/users/${userId}/points`)
        .send({ points: newPoints });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: expect.objectContaining({
          id: userId,
          points: newPoints,
        }),
      });
    });

    it('should return 400 for invalid points value', async () => {
      const userId = '1';
      const invalidPoints = -50;

      const response = await request(app)
        .post(`/api/users/${userId}/points`)
        .send({ points: invalidPoints });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        error: {
          message: 'Invalid points value',
          code: 'INVALID_POINTS',
        },
      });
    });

    it('should return 404 for non-existent user', async () => {
      const nonExistentUserId = '999';
      const newPoints = 150;

      const response = await request(app)
        .post(`/api/users/${nonExistentUserId}/points`)
        .send({ points: newPoints });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND',
        },
      });
    });
  });
}); 