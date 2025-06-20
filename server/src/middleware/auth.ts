import { Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase';
import { ApiError } from '../utils/ApiError';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError('Unauthorized: No token provided', 401, 'NO_TOKEN'));
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return next(new ApiError('Unauthorized: Malformed token', 401, 'MALFORMED_TOKEN'));
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return next(new ApiError('Unauthorized: Invalid token', 401, 'INVALID_TOKEN'));
    }

    req.user = data.user;
    next();
  } catch (error) {
    return next(new ApiError('Internal server error during authentication', 500, 'AUTH_ERROR'));
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  
  if (!user) {
    return next(new ApiError('Unauthorized: Not authenticated', 401, 'NOT_AUTHENTICATED'));
  }

  if (user.user_metadata?.role !== 'admin') {
    return next(new ApiError('Forbidden: Requires admin privileges', 403, 'FORBIDDEN_ADMIN'));
  }

  next();
}; 