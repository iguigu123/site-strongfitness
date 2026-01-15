"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticateUserController = void 0;
const tsyringe_1 = require("tsyringe");
const AuthenticateUserUseCase_1 = require("./AuthenticateUserUseCase");
const zod_1 = require("zod");
class AuthenticateUserController {
    async handle(request, response) {
        const authSchema = zod_1.z.object({
            email: zod_1.z.string().email(),
            password: zod_1.z.string(),
        });
        const { email, password } = authSchema.parse(request.body);
        const authenticateUserUseCase = tsyringe_1.container.resolve(AuthenticateUserUseCase_1.AuthenticateUserUseCase);
        const token = await authenticateUserUseCase.execute({
            email,
            password,
        });
        return response.json(token);
    }
}
exports.AuthenticateUserController = AuthenticateUserController;
