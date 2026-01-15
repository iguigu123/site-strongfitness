"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserController = void 0;
const tsyringe_1 = require("tsyringe");
const zod_1 = require("zod");
const CreateUserService_1 = require("../services/CreateUserService");
const response_1 = require("@shared/http/response");
class CreateUserController {
    async handle(request, response) {
        const createUserSchema = zod_1.z.object({
            name: zod_1.z.string().min(3),
            email: zod_1.z.string().email(),
            password: zod_1.z.string().min(6),
            isAdmin: zod_1.z.boolean().optional(),
        });
        const { name, email, password, isAdmin } = createUserSchema.parse(request.body);
        const createUserService = tsyringe_1.container.resolve(CreateUserService_1.CreateUserService);
        const user = await createUserService.execute({
            name,
            email,
            password,
            isAdmin,
        });
        return (0, response_1.successResponse)(response, user, 'User created', 201);
    }
}
exports.CreateUserController = CreateUserController;
