"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const setup_1 = require("../setup");
const users_1 = __importDefault(require("../../routes/users"));
describe('Users Routes', () => {
    let app;
    beforeEach(() => {
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use('/api/users', users_1.default);
    });
    describe('GET /api/users', () => {
        it('should return all users', async () => {
            const response = await (0, supertest_1.default)(app).get('/api/users');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                data: setup_1.mockUsers,
            });
        });
    });
    describe('POST /api/users/:id/points', () => {
        it('should update user points successfully', async () => {
            const userId = '1';
            const newPoints = 150;
            const response = await (0, supertest_1.default)(app)
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
            const response = await (0, supertest_1.default)(app)
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
            const response = await (0, supertest_1.default)(app)
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
