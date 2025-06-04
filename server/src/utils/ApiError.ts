import { ApiError as IApiError } from '../types';

export class ApiError extends Error implements IApiError {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'ApiError';
    
    // This is needed for proper prototype chain
    Object.setPrototypeOf(this, ApiError.prototype);
  }
} 