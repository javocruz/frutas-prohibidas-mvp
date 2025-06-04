"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler_1 = require("../../middleware/errorHandler");
const ApiError_1 = require("../../utils/ApiError");
describe('Error Handler Middleware', () => {
    let mockRequest;
    let mockResponse;
    let nextFunction;
    beforeEach(() => {
        mockRequest = {
            path: '/test',
            method: 'GET',
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        nextFunction = jest.fn();
    });
    it('should handle ApiError correctly', () => {
        const apiError = new ApiError_1.ApiError('Test error', 400, 'TEST_ERROR');
        (0, errorHandler_1.errorHandler)(apiError, mockRequest, mockResponse, nextFunction);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: {
                message: 'Test error',
                code: 'TEST_ERROR',
            },
        });
    });
    it('should handle generic Error correctly', () => {
        const error = new Error('Generic error');
        (0, errorHandler_1.errorHandler)(error, mockRequest, mockResponse, nextFunction);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: {
                message: 'Internal Server Error',
                code: 'INTERNAL_ERROR',
            },
        });
    });
});
