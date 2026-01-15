"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenController = void 0;
const tsyringe_1 = require("tsyringe");
const RefreshTokenService_1 = require("../services/RefreshTokenService");
const response_1 = require("@shared/http/response");
class RefreshTokenController {
    async handle(request, response) {
        const { refresh_token } = request.body;
        const refreshTokenService = tsyringe_1.container.resolve(RefreshTokenService_1.RefreshTokenService);
        const tokenData = await refreshTokenService.execute({
            refresh_token,
        });
        return (0, response_1.successResponse)(response, tokenData, 'Token refreshed successfully');
    }
}
exports.RefreshTokenController = RefreshTokenController;
