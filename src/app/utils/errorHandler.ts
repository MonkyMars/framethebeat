/**
 * Custom error class for application-specific errors
 */
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
    
    // Set the prototype explicitly
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Error types for different scenarios
 */
export enum ErrorType {
  VALIDATION_ERROR = 'ValidationError',
  AUTHENTICATION_ERROR = 'AuthenticationError',
  AUTHORIZATION_ERROR = 'AuthorizationError',
  NOT_FOUND_ERROR = 'NotFoundError',
  DATABASE_ERROR = 'DatabaseError',
  API_ERROR = 'ApiError',
  NETWORK_ERROR = 'NetworkError',
  UNKNOWN_ERROR = 'UnknownError',
}

/**
 * Create a specific error with appropriate status code
 */
export const createError = (type: ErrorType, message: string): AppError => {
  switch (type) {
    case ErrorType.VALIDATION_ERROR:
      return new AppError(message, 400);
    case ErrorType.AUTHENTICATION_ERROR:
      return new AppError(message, 401);
    case ErrorType.AUTHORIZATION_ERROR:
      return new AppError(message, 403);
    case ErrorType.NOT_FOUND_ERROR:
      return new AppError(message, 404);
    case ErrorType.DATABASE_ERROR:
      return new AppError(message, 500);
    case ErrorType.API_ERROR:
      return new AppError(message, 500);
    case ErrorType.NETWORK_ERROR:
      return new AppError(message, 503);
    case ErrorType.UNKNOWN_ERROR:
    default:
      return new AppError(message, 500);
  }
};

/**
 * Handle errors in async functions
 * @param fn The async function to execute
 * @returns A function that returns a Promise that resolves to the result or an error object
 */
export const asyncHandler = <T, A extends unknown[]>(
  fn: (...args: A) => Promise<T>
): ((...args: A) => Promise<{ data: T | null; error: AppError | null }>) => {
  return async (...args: A): Promise<{ data: T | null; error: AppError | null }> => {
    try {
      const result = await fn(...args);
      return { data: result, error: null };
    } catch (error) {
      if (error instanceof AppError) {
        return { data: null, error };
      }
      
      // Handle other types of errors
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      return { 
        data: null, 
        error: createError(ErrorType.UNKNOWN_ERROR, message)
      };
    }
  };
};

/**
 * Format error messages for user display
 */
export const formatErrorMessage = (error: AppError | Error | unknown): string => {
  if (error instanceof AppError) {
    return `Error (${error.statusCode}): ${error.message}`;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unknown error occurred';
};

/**
 * Log errors to console (can be extended to log to a service)
 */
export const logError = (error: AppError | Error | unknown): void => {
  if (error instanceof AppError) {
    console.error(`[${error.statusCode}] ${error.message}`);
    console.error(error.stack);
  } else if (error instanceof Error) {
    console.error(error.message);
    console.error(error.stack);
  } else {
    console.error('Unknown error:', error);
  }
};

/**
 * Handle API errors and return appropriate response
 */
export const handleApiError = (error: unknown): { message: string; status: number } => {
  if (error instanceof AppError) {
    return {
      message: error.message,
      status: error.statusCode,
    };
  }
  
  if (error instanceof Error) {
    return {
      message: error.message,
      status: 500,
    };
  }
  
  return {
    message: 'An unknown error occurred',
    status: 500,
  };
}; 