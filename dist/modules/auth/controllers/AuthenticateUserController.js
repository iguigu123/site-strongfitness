"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticateUserController = void 0;
const tsyringe_1 = require("tsyringe");
const zod_1 = require("zod");
const AuthenticateUserService_1 = require("../services/AuthenticateUserService");
const response_1 = require("@shared/http/response");
class AuthenticateUserController {
    async handle(request, response) {
        const authSchema = zod_1.z.object({
            email: zod_1.z.string().email(),
            password: zod_1.z.string(),
        });
        const { email, password } = authSchema.parse(request.body);
        const authenticateUserService = tsyringe_1.container.resolve(AuthenticateUserService_1.AuthenticateUserService);
        const result = await authenticateUserService.execute({
            email,
            password,
        });
        return (0, response_1.successResponse)(response, result, 'Authenticated');
    }
}
exports.AuthenticateUserController = AuthenticateUserController;
