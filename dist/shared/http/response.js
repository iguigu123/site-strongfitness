"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successResponse = successResponse;
exports.errorResponse = errorResponse;
function successResponse(response, data, message = 'OK', statusCode = 200) {
    const body = {
        success: true,
        data,
        message,
    };
    return response.status(statusCode).json(body);
}
function errorResponse(response, message, statusCode = 400) {
    const body = {
        success: false,
        data: null,
        message,
    };
    return response.status(statusCode).json(body);
}
