import { Request, Response } from 'express';
import { errorHandler } from '../../middleware/errorHandler';
import { ApiError } from '../../utils/ApiError';

describe('Error Handler Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

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
    const apiError = new ApiError('Test error', 400, 'TEST_ERROR');
    
    errorHandler(
      apiError,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

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
    
    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

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