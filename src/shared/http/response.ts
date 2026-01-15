import { Response } from 'express';

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message: string;
}

interface ApiErrorResponse {
  success: false;
  data: null;
  message: string;
}

export function successResponse<T>(
  response: Response,
  data: T,
  message = 'OK',
  statusCode = 200
) {
  const body: ApiSuccessResponse<T> = {
    success: true,
    data,
    message,
  };

  return response.status(statusCode).json(body);
}

export function errorResponse(
  response: Response,
  message: string,
  statusCode = 400
) {
  const body: ApiErrorResponse = {
    success: false,
    data: null,
    message,
  };

  return response.status(statusCode).json(body);
}

