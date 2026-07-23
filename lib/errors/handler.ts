import { logger } from "../logger";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  public readonly errors?: Record<string, string[]>;

  constructor(message: string, errors?: Record<string, string[]>) {
    super(message, 400);
    this.errors = errors;
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Unauthorized access") {
    super(message, 401);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404);
  }
}

/**
 * Global helper to handle error response inside API Routes.
 */
export function handleApiError(error: any) {
  const isOperational = error instanceof AppError ? error.isOperational : false;
  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const message = error instanceof Error ? error.message : "An unexpected error occurred";

  // Log error
  if (statusCode >= 500) {
    logger.error(`[API Error] ${message}`, { statusCode }, error);
  } else {
    logger.warn(`[API Warning] ${message}`, { statusCode, error: error.message || String(error) });
  }

  const responseBody: {
    success: false;
    error: string;
    errors?: Record<string, string[]>;
    stack?: string;
  } = {
    success: false,
    error: message,
    ...(error instanceof ValidationError ? { errors: error.errors } : {}),
  };

  // Show stack trace in development
  if (process.env.NODE_ENV === "development" && error instanceof Error) {
    responseBody.stack = error.stack;
  }

  return new Response(JSON.stringify(responseBody), {
    status: statusCode,
    headers: { "Content-Type": "application/json" },
  });
}
